import axios from 'axios';

class MarketContextService {
  constructor() {
    this.cache = {
      data: null,
      timestamp: null,
      ttl: 5 * 60 * 1000 // 5 minutes
    };
  }
  
  /**
   * Get market context for AI
   */
  async getMarketContext() {
    try {
      // Check cache
      if (this.cache.data && (Date.now() - this.cache.timestamp) < this.cache.ttl) {
        return this.cache.data;
      }
      
      // Fetch trending stocks (simplified - using Yahoo Finance)
      const trendingStocks = await this.getTrendingStocks();
      
      // Fetch top cryptos (using CoinGecko)
      const topCryptos = await this.getTopCryptos();
      
      const context = {
        trendingStocks: trendingStocks.slice(0, 5),
        topCryptos: topCryptos.slice(0, 5),
        lastUpdated: new Date().toISOString()
      };
      
      // Update cache
      this.cache.data = context;
      this.cache.timestamp = Date.now();
      
      return context;
    } catch (error) {
      console.error('Error getting market context:', error);
      return {
        error: error.message,
        trendingStocks: [],
        topCryptos: []
      };
    }
  }
  
  /**
   * Get trending stocks
   */
  async getTrendingStocks() {
    try {
      // Simplified - just return popular NSE stocks
      // In production, you'd fetch from Yahoo Finance API
      return [
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries', change: '+2.5%' },
        { symbol: 'TCS.NS', name: 'TCS', change: '+1.8%' },
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', change: '+1.2%' },
        { symbol: 'INFY.NS', name: 'Infosys', change: '-0.5%' },
        { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', change: '+0.8%' }
      ];
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      return [];
    }
  }
  
  /**
   * Get top cryptocurrencies
   */
  async getTopCryptos() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'inr',
            order: 'market_cap_desc',
            per_page: 5,
            page: 1,
            sparkline: false
          },
          timeout: 5000
        }
      );
      
      return response.data.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: `₹${coin.current_price.toLocaleString('en-IN')}`,
        change: `${coin.price_change_percentage_24h.toFixed(2)}%`
      }));
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return [];
    }
  }
  
  /**
   * Format market context for AI prompt
   */
  formatForAI(context) {
    if (!context || context.error) {
      return 'Market data temporarily unavailable.';
    }
    
    let prompt = `CURRENT MARKET DATA:\n\n`;
    
    if (context.trendingStocks && context.trendingStocks.length > 0) {
      prompt += `Trending Stocks (NSE):\n`;
      context.trendingStocks.forEach(stock => {
        prompt += `- ${stock.name} (${stock.symbol}): ${stock.change}\n`;
      });
      prompt += `\n`;
    }
    
    if (context.topCryptos && context.topCryptos.length > 0) {
      prompt += `Top Cryptocurrencies:\n`;
      context.topCryptos.forEach(crypto => {
        prompt += `- ${crypto.name} (${crypto.symbol}): ${crypto.price} (${crypto.change})\n`;
      });
    }
    
    return prompt;
  }
}

export default new MarketContextService();
