import { useState, useEffect } from 'react';
import { goalAPI } from '../services/goalService';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalAPI.getAll();
      setGoals(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const createGoal = async (goalData) => {
    try {
      const response = await goalAPI.create(goalData);
      setGoals([response.data, ...goals]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create goal');
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      const response = await goalAPI.update(id, goalData);
      setGoals(goals.map(g => g._id === id ? response.data : g));
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update goal');
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalAPI.delete(id);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete goal');
    }
  };

  const addContribution = async (id, amount, note) => {
    try {
      const response = await goalAPI.addContribution(id, amount, note);
      setGoals(goals.map(g => g._id === id ? response.data : g));
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add contribution');
    }
  };

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  };
};
