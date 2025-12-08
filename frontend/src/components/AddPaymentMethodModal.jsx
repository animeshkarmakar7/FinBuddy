import React, { useState } from 'react';
import { X, CreditCard, Wallet } from 'lucide-react';
import IndianRupee from './icons/IndianRupee';
import { paymentMethodAPI } from '../services/api';

const AddPaymentMethodModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'credit-card',
    name: '',
    number: '',
    balance: '',
    limit: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue' },
    { value: 'from-violet-500 to-purple-500', label: 'Purple' },
    { value: 'from-emerald-500 to-teal-500', label: 'Green' },
    { value: 'from-rose-500 to-pink-500', label: 'Pink' },
    { value: 'from-amber-500 to-orange-500', label: 'Orange' },
  ];

  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.number) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.balance && parseFloat(formData.balance) < 0) {
      setError('Balance cannot be negative');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const paymentMethodData = {
        ...formData,
        balance: formData.balance ? parseFloat(formData.balance) : 0,
        limit: formData.limit ? parseFloat(formData.limit) : undefined,
        color: selectedColor,
      };

      await paymentMethodAPI.create(paymentMethodData);
      
      // Reset form
      setFormData({
        type: 'credit-card',
        name: '',
        number: '',
        balance: '',
        limit: '',
        isDefault: false,
      });
      setSelectedColor(colorOptions[0].value);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment method');
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
            <h2 className="text-2xl font-bold">Add Payment Method</h2>
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

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
              <option value="digital-wallet">Digital Wallet</option>
              <option value="bank-account">Bank Account</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Visa Platinum"
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              Card/Account Number *
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="**** 1234"
              required
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-violet-600/70 mt-1">
              Enter last 4 digits or masked number
            </p>
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              <IndianRupee className="w-4 h-4 inline mr-2" />
              Current Balance
            </label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Credit Limit (for credit cards) */}
          {formData.type === 'credit-card' && (
            <div>
              <label className="block text-sm font-medium text-violet-700 mb-2">
                Credit Limit
              </label>
              <input
                type="number"
                name="limit"
                value={formData.limit}
                onChange={handleChange}
                placeholder="10000.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              Card Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedColor(option.value)}
                  className={`h-12 rounded-xl bg-gradient-to-br ${option.value} transition-all ${
                    selectedColor === option.value
                      ? 'ring-4 ring-violet-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-violet-700 cursor-pointer">
              Set as default payment method
            </label>
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
              {loading ? 'Adding...' : 'Add Payment Method'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;
