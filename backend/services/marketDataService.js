import axios from 'axios';
import EventEmitter from 'events';

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.cache = new Map();
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.isUpdating = false;
  }

  /**
   * Get trending stocks from NSE
   */
  async getTrendingStocks() {
    const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT'];
    
    const stocks = await Promise.all(
      symbols.map(symbol => this.getStockQuote(symbol))
    );
    
    return stocks.filter(Boolean).sort((a, b) => b.changePercent - a.changePercent);
  }

  /**
   * Get top gaining stocks
   */
  async getTopGainers() {
    const trending = await this.getTrendingStocks();
    return trending.filter(s => s.changePercent > 0).slice(0, 10);
  }

  /**
   * Get top losing stocks
   */
  async getTopLosers() {
    const trending = await this.getTrendingStocks();
    return trending.filter(s => s.changePercent < 0).slice(-10);
  }

  /**
   * Get stock quote from Yahoo Finance
   */
  async getStockQuote(symbol) {
    try {
      const yahooSymbol = `${symbol}.NS`;
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
      
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
      const meta = result.meta;
      const quote = result.indicators.quote[0];
      
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;
      const change = currentPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2);
      
      return {
        symbol,
        name: this.getStockName(symbol),
        type: 'stock',
        currentPrice,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent),
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        volume: meta.regularMarketVolume,
        previousClose,
        exchange: 'NSE',
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Get top cryptocurrencies
   */
  async getTopCryptos() {
    try {
      const url = 'https://api.coingecko.com/api/v3/coins/markets';
      
      const response = await axios.get(url, {
        params: {
          vs_currency: 'inr',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });
      
      return response.data.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        type: 'crypto',
        currentPrice: coin.current_price,
        change: coin.price_change_24h,
        changePercent: parseFloat(coin.price_change_percentage_24h?.toFixed(2) || 0),
        dayHigh: coin.high_24h,
        dayLow: coin.low_24h,
        volume: coin.total_volume,
        marketCap: coin.market_cap,
        image: coin.image,
        lastUpdated: new Date()
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error.message);
      return [];
    }
  }

  /**
   * Search investments
   */
  async searchInvestments(query) {
    const lowerQuery = query.toLowerCase();
    
    // Search in stocks
    const stockSymbols = this.getAllStockSymbols();
    const matchingStocks = stockSymbols.filter(s => 
      s.symbol.toLowerCase().includes(lowerQuery) || 
      s.name.toLowerCase().includes(lowerQuery)
    );
    
    // Get quotes for matching stocks
    const stocks = await Promise.all(
      matchingStocks.slice(0, 5).map(s => this.getStockQuote(s.symbol))
    );
    
    // Search in crypto
    const cryptos = await this.searchCrypto(query);
    
    return {
      stocks: stocks.filter(Boolean),
      cryptos: cryptos.slice(0, 5)
    };
  }

  /**
   * Search crypto by name/symbol
   */
  async searchCrypto(query) {
    try {
      const url = 'https://api.coingecko.com/api/v3/search';
      const response = await axios.get(url, {
        params: { query }
      });
      
      const coinIds = response.data.coins.slice(0, 5).map(c => c.id).join(',');
      
      if (!coinIds) return [];
      
      const marketUrl = 'https://api.coingecko.com/api/v3/coins/markets';
      const marketResponse = await axios.get(marketUrl, {
        params: {
          vs_currency: 'inr',
          ids: coinIds
        }
      });
      
      return marketResponse.data.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        type: 'crypto',
        currentPrice: coin.current_price,
        change: coin.price_change_24h,
        changePercent: parseFloat(coin.price_change_percentage_24h?.toFixed(2) || 0),
        image: coin.image
      }));
    } catch (error) {
      console.error('Error searching crypto:', error.message);
      return [];
    }
  }

  /**
   * Get detailed investment info
   */
  async getInvestmentDetails(symbol, type) {
    if (type === 'stock') {
      return await this.getStockDetails(symbol);
    } else if (type === 'crypto') {
      return await this.getCryptoDetails(symbol);
    }
  }

  /**
   * Get detailed stock information
   */
  async getStockDetails(symbol) {
    try {
      const quote = await this.getStockQuote(symbol);
      
      // Get historical data
      const yahooSymbol = `${symbol}.NS`;
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;
      
      const response = await axios.get(url, {
        params: {
          interval: '1d',
          range: '1y'
        }
      });
      
      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];
      
      const historicalData = timestamps.map((time, i) => ({
        date: new Date(time * 1000),
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i]
      }));
      
      return {
        ...quote,
        historicalData
      };
    } catch (error) {
      console.error(`Error fetching details for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Get detailed crypto information
   */
  async getCryptoDetails(symbol) {
    try {
      // Find coin ID
      const searchUrl = 'https://api.coingecko.com/api/v3/search';
      const searchResponse = await axios.get(searchUrl, {
        params: { query: symbol }
      });
      
      const coin = searchResponse.data.coins.find(c => 
        c.symbol.toLowerCase() === symbol.toLowerCase()
      );
      
      if (!coin) return null;
      
      // Get detailed data
      const detailUrl = `https://api.coingecko.com/api/v3/coins/${coin.id}`;
      const detailResponse = await axios.get(detailUrl, {
        params: {
          localization: false,
          tickers: false,
          community_data: false,
          developer_data: false
        }
      });
      
      const data = detailResponse.data;
      
      // Get historical chart
      const chartUrl = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`;
      const chartResponse = await axios.get(chartUrl, {
        params: {
          vs_currency: 'inr',
          days: 365
        }
      });
      
      const historicalData = chartResponse.data.prices.map(([time, price]) => ({
        date: new Date(time),
        close: price
      }));
      
      return {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        type: 'crypto',
        currentPrice: data.market_data.current_price.inr,
        change: data.market_data.price_change_24h_in_currency.inr,
        changePercent: data.market_data.price_change_percentage_24h,
        dayHigh: data.market_data.high_24h.inr,
        dayLow: data.market_data.low_24h.inr,
        marketCap: data.market_data.market_cap.inr,
        volume: data.market_data.total_volume.inr,
        image: data.image.large,
        description: data.description.en,
        historicalData
      };
    } catch (error) {
      console.error(`Error fetching crypto details for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Get stock name from symbol
   */
  getStockName(symbol) {
    const names = {
      'RELIANCE': 'Reliance Industries',
      'TCS': 'Tata Consultancy Services',
      'INFY': 'Infosys',
      'HDFCBANK': 'HDFC Bank',
      'ICICIBANK': 'ICICI Bank',
      'SBIN': 'State Bank of India',
      'BHARTIARTL': 'Bharti Airtel',
      'ITC': 'ITC Limited',
      'KOTAKBANK': 'Kotak Mahindra Bank',
      'LT': 'Larsen & Toubro'
    };
    return names[symbol] || symbol;
  }

  /**
   * Get all stock symbols
   */
  getAllStockSymbols() {
    return [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS', name: 'Tata Consultancy Services' },
      { symbol: 'INFY', name: 'Infosys' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank' },
      { symbol: 'SBIN', name: 'State Bank of India' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
      { symbol: 'ITC', name: 'ITC Limited' },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
      { symbol: 'LT', name: 'Larsen & Toubro' },
      { symbol: 'WIPRO', name: 'Wipro' },
      { symbol: 'AXISBANK', name: 'Axis Bank' },
      { symbol: 'TATAMOTORS', name: 'Tata Motors' },
      { symbol: 'TATASTEEL', name: 'Tata Steel' },
      { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical' }
    ];
  }
}

export default new MarketDataService();
