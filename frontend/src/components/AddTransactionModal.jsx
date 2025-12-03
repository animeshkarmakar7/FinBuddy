import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, CreditCard, Sparkles, Check } from 'lucide-react';
import { transactionAPI } from '../services/api';
import { useAICategorization } from '../hooks/useAICategorization';

const AddTransactionModal = ({ isOpen, onClose, onSuccess, type = 'expense' }) => {
  const [formData, setFormData] = useState({
    type: type,
    category: '',
    merchant: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    paymentMethod: 'Cash',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  // AI Categorization Hook
  const {
    category: aiCategory,
    confidence,
    alternatives,
    loading: aiLoading,
    source,
    learnCorrection,
  } = useAICategorization(formData.merchant, formData.amount, formData.type);

  // Update form type when prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: type,
      category: '', // Reset category when type changes
    }));
  }, [type]);

  // Auto-fill category when AI suggests one
  useEffect(() => {
    if (aiCategory && !formData.category && confidence > 0.7) {
      setFormData(prev => ({ ...prev, category: aiCategory }));
      setShowAISuggestion(true);
    }
  }, [aiCategory, confidence]);

  const categories = {
    expense: ['Shopping', 'Food & Dining', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
    investment: ['Stocks', 'Cryptocurrency', 'Mutual Funds', 'Real Estate', 'Bonds', 'Other'],
  };

  const iconMap = {
    'Shopping': 'ShoppingBag',
    'Food & Dining': 'Utensils',
    'Transportation': 'Car',
    'Utilities': 'Home',
    'Entertainment': 'Coffee',
    'Healthcare': 'Heart',
    'Salary': 'DollarSign',
    'Freelance': 'Briefcase',
    'Investment': 'TrendingUp',
    'Stocks': 'TrendingUp',
    'Cryptocurrency': 'TrendingUp',
    'Mutual Funds': 'TrendingUp',
  };

  const colorMap = {
    expense: 'rose',
    income: 'emerald',
    investment: 'violet',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.merchant || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        icon: iconMap[formData.category] || 'DollarSign',
        color: colorMap[formData.type],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      console.log('Submitting transaction:', transactionData); // Debug log

      await transactionAPI.create(transactionData);
      
      // Reset form
      setFormData({
        type: type,
        category: '',
        merchant: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        paymentMethod: 'Cash',
        notes: '',
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-violet-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
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
            <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg text-rose-700 text-sm">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select category</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Merchant/Source */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              {type === 'income' ? 'Source *' : type === 'investment' ? 'Investment Name *' : 'Merchant *'}
            </label>
            <input
              type="text"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              placeholder={
                type === 'income' 
                  ? 'e.g., Salary, Freelance, Dividends, Business Income' 
                  : type === 'investment' 
                  ? 'e.g., Apple Inc (AAPL), Bitcoin, Vanguard Fund' 
                  : 'e.g., Amazon, Walmart, Starbucks'
              }
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-violet-600/70 mt-1">
              {type === 'income' 
                ? 'Enter the source of your income (employer, client, investment, etc.)' 
                : type === 'investment'
                ? 'Enter the name of your investment (stock, crypto, fund, etc.)'
                : 'Enter where you made this purchase'}
            </p>

            {/* AI Category Suggestion */}
            {aiCategory && formData.merchant.length >= 3 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-800">AI Suggestion</span>
                  {source === 'user' && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Learned
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-violet-900">{aiCategory}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1.5 bg-violet-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-violet-600">
                        {Math.round(confidence * 100)}% confident
                      </span>
                    </div>
                  </div>
                  
                  {formData.category !== aiCategory && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: aiCategory }))}
                      className="px-3 py-1.5 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Use This
                    </button>
                  )}
                </div>

                {/* Alternative Suggestions */}
                {alternatives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-violet-200">
                    <p className="text-xs text-violet-600 mb-1">Or try:</p>
                    <div className="flex flex-wrap gap-1">
                      {alternatives.map((alt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: alt.category }))}
                          className="px-2 py-1 bg-white border border-violet-200 text-xs text-violet-700 rounded-lg hover:bg-violet-50 transition-colors"
                        >
                          {alt.category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Loading Indicator */}
            {aiLoading && formData.merchant.length >= 3 && (
              <div className="mt-2 flex items-center gap-2 text-xs text-violet-600">
                <div className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing merchant...</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Payment Method
            </label>
            <input
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              placeholder="e.g., Cash, Credit Card"
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
