import { useState, useEffect } from 'react';
import { aiCoachAPI } from '../services/aiCoachService';

export const useAICoach = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiCoachAPI.getInsights();
      setInsights(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get insights');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeSpending = async (category = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiCoachAPI.analyzeSpending(category);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze spending');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGoalCoaching = async (goalId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiCoachAPI.getGoalCoaching(goalId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get goal coaching');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    error,
    getInsights,
    analyzeSpending,
    getGoalCoaching,
  };
};

export const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (userMessage) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message to chat
      const newUserMessage = { role: 'user', content: userMessage };
      setMessages(prev => [...prev, newUserMessage]);

      // Get AI response
      const response = await aiCoachAPI.chat(userMessage, messages);
      
      // Add AI response to chat
      const aiMessage = { role: 'model', content: response.data.message };
      setMessages(prev => [...prev, aiMessage]);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
  };
};
