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
  const [suggestedAction, setSuggestedAction] = useState(null);

  const sendMessage = async (userMessage) => {
    try {
      setLoading(true);
      setError(null);
      setSuggestedAction(null);

      // Add user message to chat
      const newUserMessage = { role: 'user', content: userMessage };
      setMessages(prev => [...prev, newUserMessage]);

      // Get AI response
      const response = await aiCoachAPI.chat(userMessage, messages);
      
      // Add AI response to chat
      const aiMessage = { role: 'model', content: response.data.message };
      setMessages(prev => [...prev, aiMessage]);
      
      // Set suggested action if present
      if (response.data.suggestedAction) {
        setSuggestedAction(response.data.suggestedAction);
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const executeAction = async (action) => {
    try {
      let response;
      
      switch(action.action) {
        case 'create_goal':
          response = await aiCoachAPI.executeCreateGoal({
            title: action.title,
            targetAmount: action.targetAmount,
            deadline: action.deadline,
            category: action.category
          });
          break;
          
        case 'add_transaction':
          response = await aiCoachAPI.executeAddTransaction({
            type: action.type,
            amount: action.amount,
            category: action.category,
            merchant: action.merchant,
            description: action.description
          });
          break;
          
        case 'update_goal':
          response = await aiCoachAPI.executeUpdateGoal({
            goalTitle: action.goalTitle,
            amount: action.amount,
            note: action.note
          });
          break;
          
        default:
          throw new Error('Unknown action type');
      }
      
      // Clear suggested action after execution
      setSuggestedAction(null);
      
      // Add confirmation message to chat
      const confirmMessage = {
        role: 'model',
        content: `✅ ${response.data.message}`
      };
      setMessages(prev => [...prev, confirmMessage]);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute action');
      throw err;
    }
  };
  
  const dismissAction = () => {
    setSuggestedAction(null);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setSuggestedAction(null);
  };

  return {
    messages,
    loading,
    error,
    suggestedAction,
    sendMessage,
    executeAction,
    dismissAction,
    clearChat,
  };
};
