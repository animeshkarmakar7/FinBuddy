import axios from 'axios';
import Transaction from '../models/Transaction.js';

const FORECAST_API = process.env.FORECAST_API_URL || 'http://localhost:5001';

class ForecastService {
  /**
   * Predict future spending using Prophet
   */
  async predictSpending(userId, months = 6) {
    try {
      // Get user transactions (last 6 months minimum)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const transactions = await Transaction.find({
        userId,
        date: { $gte: sixMonthsAgo },
      }).sort({ date: 1 });
      
      if (transactions.length < 10) {
        throw new Error('Not enough transaction data for forecasting. Need at least 3 months of data.');
      }
      
      // Call Python microservice
      const response = await axios.post(
        `${FORECAST_API}/api/forecast/spending`,
        {
          transactions: transactions.map(t => ({
            date: t.date,
            amount: t.amount,
            type: t.type,
            category: t.category,
          })),
          months,
        },
        {
          timeout: 15000, // 15 second timeout
        }
      );
      
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Forecasting service is not available. Please ensure Python service is running.');
      }
      console.error('Forecast error:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate forecast');
    }
  }
  
  /**
   * Calculate goal achievement probability
   */
  async calculateGoalProbability(goalId, userId) {
    try {
      const Goal = (await import('../models/Goal.js')).default;
      const goal = await Goal.findById(goalId);
      
      if (!goal || goal.userId.toString() !== userId) {
        throw new Error('Goal not found');
      }
      
      // Get transactions
      const transactions = await Transaction.find({ userId }).sort({ date: 1 });
      
      if (transactions.length < 10) {
        throw new Error('Not enough transaction data for probability calculation');
      }
      
      // Get user stats for monthly income
      const stats = await this.getUserStats(userId);
      
      // Call Python microservice
      const response = await axios.post(
        `${FORECAST_API}/api/forecast/goal-probability`,
        {
          goal: {
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline.toISOString(),
            monthlyIncome: stats.monthlyIncome,
          },
          transactions: transactions.map(t => ({
            date: t.date,
            amount: t.amount,
            type: t.type,
          })),
        },
        {
          timeout: 15000,
        }
      );
      
      // Update goal with probability
      goal.achievementProbability = response.data.probability;
      await goal.save();
      
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Forecasting service is not available');
      }
      console.error('Goal probability error:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to calculate goal probability');
    }
  }
  
  /**
   * Get user financial statistics
   */
  async getUserStats(userId) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const transactions = await Transaction.find({
      userId,
      date: { $gte: threeMonthsAgo },
    });
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      monthlyIncome: income / 3,
      monthlyExpense: expense / 3,
      monthlySavings: (income - expense) / 3,
    };
  }
  
  /**
   * Check if forecasting service is available
   */
  async checkServiceHealth() {
    try {
      const response = await axios.get(`${FORECAST_API}/health`, { timeout: 5000 });
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

export default new ForecastService();
