import api from './api';

// AI Categorization API calls
export const aiAPI = {
  // Categorize a transaction
  categorize: async (merchant, amount, type) => {
    const response = await api.post('/ai/categorize', {
      merchant,
      amount,
      type,
    });
    return response.data;
  },

  // Learn from user correction
  learn: async (merchant, suggestedCategory, correctCategory) => {
    const response = await api.post('/ai/learn', {
      merchant,
      suggestedCategory,
      correctCategory,
    });
    return response.data;
  },

  // Get category suggestions
  getSuggestions: async (merchant, amount, type) => {
    const response = await api.post('/ai/suggestions', {
      merchant,
      amount,
      type,
    });
    return response.data;
  },

  // Get user's learned mappings
  getMappings: async () => {
    const response = await api.get('/ai/mappings');
    return response.data;
  },

  // Batch categorize transactions
  batchCategorize: async (transactions) => {
    const response = await api.post('/ai/batch-categorize', {
      transactions,
    });
    return response.data;
  },
};
