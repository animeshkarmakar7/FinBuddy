import React, { useState } from 'react';
import { Target, Calendar, DollarSign, TrendingUp, Plus, Trash2, Sparkles } from 'lucide-react';
import GoalOptimizer from './GoalOptimizer';

const GoalCard = ({ goal, onDelete, onAddContribution }) => {
  const [showContribution, setShowContribution] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');
  const [showOptimizer, setShowOptimizer] = useState(false);

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  
  // Calculate days remaining
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  const categoryColors = {
    vehicle: 'blue',
    education: 'purple',
    travel: 'green',
    emergency: 'red',
    home: 'orange',
    investment: 'indigo',
    other: 'gray',
  };

  const priorityColors = {
    low: 'gray',
    medium: 'yellow',
    high: 'red',
  };

  const color = categoryColors[goal.category] || 'gray';
  const priorityColor = priorityColors[goal.priority] || 'gray';

  const handleAddContribution = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return;

    try {
      await onAddContribution(goal._id, parseFloat(contributionAmount), contributionNote);
      setContributionAmount('');
      setContributionNote('');
      setShowContribution(false);
    } catch (err) {
      console.error('Failed to add contribution:', err);
    }
  };

  const categoryEmojis = {
    vehicle: '🚗',
    education: '🎓',
    travel: '✈️',
    emergency: '🚨',
    home: '🏠',
    investment: '📈',
    other: '🎯',
  };

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-lg border-2 border-${color}-100 overflow-hidden hover:shadow-xl transition-all`}>
        {/* Header */}
        <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-4`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{categoryEmojis[goal.category]}</span>
              <div>
                <h3 className="text-white font-bold text-lg">{goal.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full bg-${priorityColor}-100 text-${priorityColor}-700 font-medium`}>
                  {goal.priority} priority
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(goal._id)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-violet-600">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 transition-all duration-500`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-violet-50 rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">Current</p>
              <p className="text-lg font-bold text-violet-600">₹{goal.currentAmount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-gray-600 mb-1">Target</p>
              <p className="text-lg font-bold text-purple-600">₹{goal.targetAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Remaining */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Remaining</p>
            <p className="text-xl font-bold text-orange-600">₹{remaining.toLocaleString()}</p>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
            <span className={`font-semibold ${daysRemaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
            </span>
          </div>

          {/* AI Probability (if available) */}
          {goal.achievementProbability && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-3 border border-violet-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-semibold text-violet-800">AI Prediction</span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-violet-600">{goal.achievementProbability}%</span> chance of achieving on time
              </p>
            </div>
          )}

          {/* AI Optimizer Button */}
          {goal.status === 'active' && (
            <button
              onClick={() => setShowOptimizer(true)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              AI Optimizer & Recommendations
            </button>
          )}

          {/* Add Contribution */}
          {goal.status === 'active' && (
            <div>
              {!showContribution ? (
                <button
                  onClick={() => setShowContribution(true)}
                  className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Contribution
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full px-3 py-2 border-2 border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="text"
                    value={contributionNote}
                    onChange={(e) => setContributionNote(e.target.value)}
                    placeholder="Note (optional)"
                    className="w-full px-3 py-2 border-2 border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowContribution(false)}
                      className="flex-1 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddContribution}
                      className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed Badge */}
          {goal.status === 'completed' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
              <p className="text-green-700 font-bold flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Goal Achieved! 🎉
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Goal Optimizer Modal */}
      {showOptimizer && (
        <GoalOptimizer
          goalId={goal._id}
          onClose={() => setShowOptimizer(false)}
        />
      )}
    </>
  );
};

export default GoalCard;
