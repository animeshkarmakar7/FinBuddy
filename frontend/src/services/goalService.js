import api from './api';

// Goal API calls
export const goalAPI = {
  // Get all goals
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  // Get single goal
  getById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // Create new goal
  create: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Update goal
  update: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Delete goal
  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  // Add contribution
  addContribution: async (id, amount, note) => {
    const response = await api.post(`/goals/${id}/contribute`, { amount, note });
    return response.data;
  },

  // Get optimization plan
  getOptimization: async (id) => {
    const response = await api.get(`/goals/${id}/optimize`);
    return response.data;
  },
};

// Forecast API calls
export const forecastAPI = {
  // Get spending forecast
  getSpendingForecast: async (months = 6) => {
    const response = await api.get(`/forecast/spending/${months}`);
    return response.data;
  },

  // Check forecast service health
  checkHealth: async () => {
    const response = await api.get('/forecast/health');
    return response.data;
  },
};
