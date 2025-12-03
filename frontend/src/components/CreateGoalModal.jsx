import React, { useState } from 'react';
import { X, Target, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

const CreateGoalModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium',
    category: 'other',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'vehicle', label: '🚗 Vehicle', color: 'blue' },
    { value: 'education', label: '🎓 Education', color: 'purple' },
    { value: 'travel', label: '✈️ Travel', color: 'green' },
    { value: 'emergency', label: '🚨 Emergency Fund', color: 'red' },
    { value: 'home', label: '🏠 Home', color: 'orange' },
    { value: 'investment', label: '📈 Investment', color: 'indigo' },
    { value: 'other', label: '🎯 Other', color: 'gray' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'red' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.targetAmount) <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        priority: 'medium',
        category: 'other',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-7 h-7" />
              Create New Goal
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              Goal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Buy a new bike, Save for vacation"
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about your goal..."
              rows="3"
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Amount Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Target Amount *
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="30000"
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Current Savings
              </label>
              <input
                type="number"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Target Date *
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.category === cat.value
                      ? 'border-violet-600 bg-violet-50 text-violet-700'
                      : 'border-gray-200 hover:border-violet-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              Priority Level
            </label>
            <div className="flex gap-2">
              {priorities.map(pri => (
                <button
                  key={pri.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: pri.value })}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all font-medium ${
                    formData.priority === pri.value
                      ? 'border-violet-600 bg-violet-50 text-violet-700'
                      : 'border-gray-200 hover:border-violet-300'
                  }`}
                >
                  {pri.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalModal;
