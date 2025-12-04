import api from './api';

const AI_COACH_BASE = '/ai-coach';

export const aiCoachAPI = {
  // Get financial insights
  getInsights: () => api.get(`${AI_COACH_BASE}/insights`),

  // Analyze spending (optional category)
  analyzeSpending: (category = null) => 
    api.get(`${AI_COACH_BASE}/analyze${category ? `/${category}` : ''}`),

  // Get goal-specific coaching
  getGoalCoaching: (goalId) => api.get(`${AI_COACH_BASE}/goal/${goalId}`),

  // Chat with AI coach
  chat: (message, history = []) => 
    api.post(`${AI_COACH_BASE}/chat`, { message, history }),
};
