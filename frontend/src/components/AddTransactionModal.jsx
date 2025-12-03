import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, CreditCard } from 'lucide-react';
import { transactionAPI } from '../services/api';

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

  // Update form type when prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: type,
      category: '', // Reset category when type changes
    }));
  }, [type]);

  const categories = {
    expense: ['Shopping', 'Food & Dining', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Other'],
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
