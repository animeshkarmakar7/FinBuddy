import api from './api';

// Market API
export const marketAPI = {
  // Get trending stocks
  getTrendingStocks: () => api.get('/market/trending/stocks'),
  
  // Get top gainers
  getTopGainers: () => api.get('/market/stocks/gainers'),
  
  // Get top losers
  getTopLosers: () => api.get('/market/stocks/losers'),
  
  // Get top cryptos
  getTopCryptos: () => api.get('/market/crypto/top'),
  
  // Search investments
  search: (query) => api.get(`/market/search?q=${encodeURIComponent(query)}`),
  
  // Get investment details
  getDetails: (symbol, type) => api.get(`/market/details/${symbol}?type=${type}`),
  
  // Get stock quote
  getQuote: (symbol) => api.get(`/market/quote/${symbol}`)
};

export default marketAPI;
