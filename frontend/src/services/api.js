import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/updateprofile', userData);
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/auth/updatepreferences', preferences);
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.get('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

// Transaction API calls
export const transactionAPI = {
  // Get all transactions
  getAll: async (filters = {}) => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  // Get transaction by ID
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Create transaction
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  // Update transaction
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Delete transaction
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Get transaction statistics
  getStats: async () => {
    const response = await api.get('/transactions/stats');
    return response.data;
  },
};

// Payment Method API calls
export const paymentMethodAPI = {
  // Get all payment methods
  getAll: async () => {
    const response = await api.get('/payment-methods');
    return response.data;
  },

  // Create payment method
  create: async (paymentMethodData) => {
    const response = await api.post('/payment-methods', paymentMethodData);
    return response.data;
  },

  // Update payment method
  update: async (id, paymentMethodData) => {
    const response = await api.put(`/payment-methods/${id}`, paymentMethodData);
    return response.data;
  },

  // Delete payment method
  delete: async (id) => {
    const response = await api.delete(`/payment-methods/${id}`);
    return response.data;
  },
};

// Analytics API calls
export const analyticsAPI = {
  // Get spending by category
  getSpendingByCategory: async () => {
    const response = await api.get('/analytics/spending-by-category');
    return response.data;
  },

  // Get monthly trend
  getMonthlyTrend: async () => {
    const response = await api.get('/analytics/monthly-trend');
    return response.data;
  },

  // Get wallet balance
  getWalletBalance: async () => {
    const response = await api.get('/analytics/wallet-balance');
    return response.data;
  },
};

export default api;
