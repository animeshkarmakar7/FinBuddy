import React, { useState } from 'react';
import { Target, Plus, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import IndianRupee from './icons/IndianRupee';
import { useGoals } from '../hooks/useGoals';
import CreateGoalModal from './CreateGoalModal';
import GoalCard from './GoalCard';

const Goals = () => {
  const { goals, loading, error, createGoal, deleteGoal, addContribution } = useGoals();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Target className="w-10 h-10 text-violet-600" />
              Financial Goals
            </h1>
            <p className="text-gray-600 mt-2">Track and achieve your financial dreams with AI-powered insights</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Goals</p>
              <p className="text-3xl font-bold text-violet-600 mt-1">{activeGoals.length}</p>
            </div>
            <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
              <Target className="w-7 h-7 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{completedGoals.length}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Saved</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                ₹{goals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <IndianRupee className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-violet-600" />
          Active Goals
        </h2>
        
        {activeGoals.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-violet-100">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Goals</h3>
            <p className="text-gray-500 mb-6">Start your financial journey by creating your first goal!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onDelete={deleteGoal}
                onAddContribution={addContribution}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map(goal => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onDelete={deleteGoal}
                onAddContribution={addContribution}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  );
};

export default Goals;
