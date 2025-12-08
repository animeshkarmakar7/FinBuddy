import api from './api';

// Investment API
export const investmentAPI = {
  // Get all investments
  getAll: () => api.get('/investments'),
  
  // Get single investment
  getById: (id) => api.get(`/investments/${id}`),
  
  // Create investment
  create: (data) => api.post('/investments', data),
  
  // Update investment
  update: (id, data) => api.put(`/investments/${id}`, data),
  
  // Delete investment
  delete: (id) => api.delete(`/investments/${id}`),
  
  // Add transaction
  addTransaction: (id, transaction) => api.post(`/investments/${id}/transaction`, transaction),
  
  // Portfolio endpoints
  getPortfolioSummary: () => api.get('/investments/portfolio/summary'),
  getSectorAllocation: () => api.get('/investments/portfolio/sectors'),
  getPortfolioMetrics: () => api.get('/investments/portfolio/metrics'),
  
  // Force price update
  forcePriceUpdate: (symbol, type) => api.post('/investments/price-update', { symbol, type })
};

export default investmentAPI;
