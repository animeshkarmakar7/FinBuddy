import axios from 'axios';
import Investment from '../models/Investment.js';
import EventEmitter from 'events';

class PriceUpdateService extends EventEmitter {
  constructor() {
    super();
    this.priceCache = new Map();
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.isUpdating = false;
  }
  
  /**
   * Start price update service
   */
  start() {
    console.log('🔄 Price update service started');
    
    // Initial update
    this.updateAllPrices();
    
    // Schedule periodic updates
    setInterval(() => {
      this.updateAllPrices();
    }, this.updateInterval);
  }
  
  /**
   * Update all investment prices
   */
  async updateAllPrices() {
    if (this.isUpdating) {
      console.log('⏭️  Price update already in progress, skipping...');
      return;
    }
    
    try {
      this.isUpdating = true;
      console.log('📊 Updating investment prices...');
      
      const investments = await Investment.find({ active: true });
      
      if (investments.length === 0) {
        console.log('No active investments to update');
        return;
      }
      
      // Group by type
      const stocks = investments.filter(inv => inv.type === 'stock');
      const cryptos = investments.filter(inv => inv.type === 'crypto');
      const mutualFunds = investments.filter(inv => inv.type === 'mutual_fund');
      
      // Update prices
      await Promise.all([
        this.updateStockPrices(stocks),
        this.updateCryptoPrices(cryptos),
        this.updateMutualFundPrices(mutualFunds)
      ]);
      
      console.log(`✅ Updated prices for ${investments.length} investments`);
    } catch (error) {
      console.error('❌ Error updating prices:', error.message);
    } finally {
      this.isUpdating = false;
    }
  }
  
  /**
   * Update stock prices using Yahoo Finance
   */
  async updateStockPrices(stocks) {
    for (const stock of stocks) {
      try {
        const symbol = stock.exchange === 'NSE' 
          ? `${stock.symbol}.NS` 
          : `${stock.symbol}.BO`;
        
        const price = await this.fetchYahooPrice(symbol);
        
        if (price) {
          await stock.updatePrice(price);
          this.priceCache.set(stock.symbol, price);
          
          // Emit price update event for WebSocket
          this.emit('priceUpdate', {
            symbol: stock.symbol,
            price,
            type: 'stock'
          });
        }
      } catch (error) {
        console.error(`Error updating ${stock.symbol}:`, error.message);
      }
    }
  }
  
  /**
   * Fetch price from Yahoo Finance
   */
  async fetchYahooPrice(symbol) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      
      const response = await axios.get(url, {
        params: {
          interval: '1d',
          range: '1d'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      const result = response.data.chart.result[0];
      const price = result.meta.regularMarketPrice;
      
      return price;
    } catch (error) {
      console.error(`Yahoo Finance error for ${symbol}:`, error.message);
      return null;
    }
  }
  
  /**
   * Update crypto prices using CoinGecko
   */
  async updateCryptoPrices(cryptos) {
    if (cryptos.length === 0) return;
    
    try {
      // Map symbols to CoinGecko IDs
      const cryptoMap = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'BNB': 'binancecoin',
        'DOGE': 'dogecoin',
        'ADA': 'cardano',
        'XRP': 'ripple',
        'SOL': 'solana',
        'MATIC': 'matic-network'
      };
      
      const ids = cryptos
        .map(c => cryptoMap[c.symbol])
        .filter(Boolean)
        .join(',');
      
      if (!ids) return;
      
      const url = 'https://api.coingecko.com/api/v3/simple/price';
      const response = await axios.get(url, {
        params: {
          ids,
          vs_currencies: 'inr'
        }
      });
      
      for (const crypto of cryptos) {
        const coinId = cryptoMap[crypto.symbol];
        const price = response.data[coinId]?.inr;
        
        if (price) {
          await crypto.updatePrice(price);
          this.priceCache.set(crypto.symbol, price);
          
          this.emit('priceUpdate', {
            symbol: crypto.symbol,
            price,
            type: 'crypto'
          });
        }
      }
    } catch (error) {
      console.error('CoinGecko error:', error.message);
    }
  }
  
  /**
   * Update mutual fund NAV
   */
  async updateMutualFundPrices(funds) {
    for (const fund of funds) {
      try {
        // Using MF API (free)
        const url = `https://api.mfapi.in/mf/${fund.symbol}`;
        const response = await axios.get(url);
        
        const nav = parseFloat(response.data.data[0].nav);
        
        if (nav) {
          await fund.updatePrice(nav);
          this.priceCache.set(fund.symbol, nav);
          
          this.emit('priceUpdate', {
            symbol: fund.symbol,
            price: nav,
            type: 'mutual_fund'
          });
        }
      } catch (error) {
        console.error(`MF API error for ${fund.symbol}:`, error.message);
      }
    }
  }
  
  /**
   * Get cached price
   */
  getCachedPrice(symbol) {
    return this.priceCache.get(symbol);
  }
  
  /**
   * Force update for specific symbol
   */
  async forceUpdate(symbol, type) {
    const investment = await Investment.findOne({ symbol, type, active: true });
    
    if (!investment) {
      throw new Error('Investment not found');
    }
    
    switch (type) {
      case 'stock':
        await this.updateStockPrices([investment]);
        break;
      case 'crypto':
        await this.updateCryptoPrices([investment]);
        break;
      case 'mutual_fund':
        await this.updateMutualFundPrices([investment]);
        break;
    }
    
    return this.getCachedPrice(symbol);
  }
}

export default new PriceUpdateService();
