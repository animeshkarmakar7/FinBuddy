import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Target, Calendar, Zap, CheckCircle, X, Info } from 'lucide-react';
import IndianRupee from './icons/IndianRupee';
import { goalAPI } from '../services/goalService';

const GoalOptimizer = ({ goalId, onClose }) => {
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetchOptimization();
  }, [goalId]);

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      const response = await goalAPI.getOptimization(goalId);
      setOptimization(response.data);
      setError(null);
      setDemoMode(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load optimization plan';
      
      // Check if error is due to insufficient data
      if (errorMsg.includes('Not enough transaction data') || errorMsg.includes('Need at least 3 months')) {
        // Enable demo mode with basic recommendations
        setDemoMode(true);
        setError(null);
        // Get goal data for demo recommendations
        const goalResponse = await goalAPI.getById(goalId);
        setOptimization({ goal: goalResponse.data, forecast: null, probability: null });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-violet-600 font-semibold">Analyzing your finances with AI...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Generate Optimization</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { goal, forecast, probability } = optimization;
  const predictions = forecast?.predictions || [];
  const patterns = forecast?.patterns || {};
  
  // Calculate basic metrics for demo mode
  const remaining = goal.targetAmount - goal.currentAmount;
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const monthsRemaining = Math.max(1, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24 * 30)));
  const requiredMonthlySavings = remaining / monthsRemaining;

  // Calculate savings potential from predictions
  const avgMonthlySpending = predictions.length > 0 
    ? predictions.reduce((sum, p) => sum + p.spending, 0) / predictions.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-7 h-7" />
                AI Goal Optimizer
              </h2>
              <p className="text-violet-100 mt-1">Personalized recommendations to achieve your goal faster</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Goal Summary */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-violet-600" />
              {goal.title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current</p>
                <p className="text-2xl font-bold text-violet-600">₹{goal.currentAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target</p>
                <p className="text-2xl font-bold text-purple-600">₹{goal.targetAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-orange-600">₹{(goal.targetAmount - goal.currentAmount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="text-lg font-bold text-gray-800">{new Date(goal.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Demo Mode Notice */}
          {demoMode && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-800 mb-1">Limited Data Mode</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    You need at least 3 months of transaction history for AI forecasting. 
                    Add more transactions to unlock Prophet-powered predictions!
                  </p>
                  <p className="text-xs text-blue-600">
                    For now, here are general recommendations based on your goal:
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Goal Analysis (Demo Mode) */}
          {demoMode && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-violet-600" />
                Goal Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Required Monthly Savings</p>
                  <p className="text-2xl font-bold text-violet-600">₹{requiredMonthlySavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">To reach goal by deadline</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Months Remaining</p>
                  <p className="text-2xl font-bold text-purple-600">{monthsRemaining}</p>
                  <p className="text-xs text-gray-500 mt-1">Until {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">💡 To achieve your goal:</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <span>Save <strong>₹{requiredMonthlySavings.toLocaleString()}</strong> every month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <span>Or make a one-time contribution of <strong>₹{remaining.toLocaleString()}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <span>Track your progress regularly and adjust as needed</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Achievement Probability */}
          {probability && (
            <div className={`rounded-xl p-6 border-2 ${
              probability.probability >= 80 ? 'bg-green-50 border-green-200' :
              probability.probability >= 60 ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Achievement Probability
                </h3>
                <span className={`text-4xl font-bold ${
                  probability.probability >= 80 ? 'text-green-600' :
                  probability.probability >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {probability.probability}%
                </span>
              </div>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    probability.recommendation.status === 'excellent' ? 'bg-green-100' :
                    probability.recommendation.status === 'good' ? 'bg-yellow-100' :
                    probability.recommendation.status === 'warning' ? 'bg-orange-100' :
                    'bg-red-100'
                  }`}>
                    {probability.recommendation.status === 'excellent' || probability.recommendation.status === 'good' ? (
                      <CheckCircle className={`w-6 h-6 ${
                        probability.recommendation.status === 'excellent' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    ) : (
                      <AlertCircle className={`w-6 h-6 ${
                        probability.recommendation.status === 'warning' ? 'text-orange-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">{probability.recommendation.message}</p>
                    <p className="text-sm text-gray-600">{probability.recommendation.action}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Predicted Savings</p>
                  <p className="text-xl font-bold text-green-600">₹{probability.predictedSavings?.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Months Remaining</p>
                  <p className="text-xl font-bold text-blue-600">{probability.monthsRemaining}</p>
                </div>
              </div>
            </div>
          )}

          {/* Spending Forecast */}
          {predictions.length > 0 && (
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                6-Month Spending Forecast
              </h3>
              
              <div className="space-y-3">
                {predictions.slice(0, 6).map((pred, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-800">{pred.month}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">₹{pred.spending.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        Range: ₹{pred.lower.toLocaleString()} - ₹{pred.upper.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {patterns.trend && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    {patterns.trend.direction === 'increasing' ? (
                      <TrendingUp className="w-5 h-5 text-red-600" />
                    ) : patterns.trend.direction === 'decreasing' ? (
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    ) : (
                      <IndianRupee className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="font-semibold text-gray-800">Spending Trend: {patterns.trend.direction}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your spending is {patterns.trend.direction} by {Math.abs(patterns.trend.percentage)}% 
                    ({patterns.trend.change >= 0 ? '+' : ''}₹{patterns.trend.change.toLocaleString()}/month)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-600" />
              AI-Powered Recommendations
            </h3>
            
            <div className="space-y-4">
              {/* Example recommendations - In real implementation, these would come from pattern analysis */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800">Optimize Monthly Spending</h4>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    High Impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Based on your forecast, reducing spending by 15% would help you reach your goal {probability?.monthsRemaining ? Math.round(probability.monthsRemaining * 0.15) : 1} month(s) faster.
                </p>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-purple-800 mb-1">Suggested Actions:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Review recurring subscriptions and cancel unused ones</li>
                    <li>• Set a weekly dining out budget limit</li>
                    <li>• Use cashback and rewards programs</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800">Increase Savings Rate</h4>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Medium Impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Current average spending: ₹{avgMonthlySpending.toLocaleString()}/month. 
                  Saving an extra ₹{Math.round(avgMonthlySpending * 0.1).toLocaleString()}/month would significantly improve your timeline.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800 mb-1">Quick Wins:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Automate savings transfers on payday</li>
                    <li>• Use the 50/30/20 budgeting rule</li>
                    <li>• Track daily expenses with FinBuddy</li>
                  </ul>
                </div>
              </div>

              {patterns.trend?.direction === 'increasing' && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-600">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-800">Control Spending Growth</h4>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      Urgent
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    ⚠️ Your spending is increasing by {Math.abs(patterns.trend.percentage)}% per month. 
                    This trend could delay your goal achievement.
                  </p>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-orange-800 mb-1">Immediate Actions:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Identify and eliminate unnecessary expenses</li>
                      <li>• Set strict category budgets</li>
                      <li>• Review and adjust spending habits weekly</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Close
            </button>
            <button
              onClick={fetchOptimization}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Refresh Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalOptimizer;
