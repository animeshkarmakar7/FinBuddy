import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight, AlertCircle, CheckCircle, Info } from 'lucide-react';
import api from '../services/api';

const ComparativeAnalysis = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparisonType, setComparisonType] = useState('month'); // 'month' or 'year'
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  useEffect(() => {
    fetchComparison();
  }, [comparisonType, selectedDate]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const endpoint = comparisonType === 'month' 
        ? '/analytics/comparison/month-over-month'
        : '/analytics/comparison/year-over-year';
      
      const response = await api.get(endpoint, {
        params: {
          year: selectedDate.year,
          month: selectedDate.month
        }
      });
      
      setComparison(response.data.data);
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getTrendColor = (trend, isExpense = true) => {
    if (trend === 'stable') return 'text-gray-600';
    if (isExpense) {
      return trend === 'up' ? 'text-red-600' : 'text-green-600';
    } else {
      return trend === 'up' ? 'text-green-600' : 'text-red-600';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="text-center p-12 text-gray-500">
        No comparison data available
      </div>
    );
  }

  const { current, previous, changes, insights } = comparison;

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Comparative Analysis</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setComparisonType('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              comparisonType === 'month'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month-over-Month
          </button>
          <button
            onClick={() => setComparisonType('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              comparisonType === 'year'
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Year-over-Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Income</h3>
            {getTrendIcon(changes.income.trend)}
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(changes.income.current)}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Previous:</span>
              <span className="font-medium">{formatCurrency(changes.income.previous)}</span>
            </div>
            
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(changes.income.trend, false)}`}>
              {changes.income.trend !== 'stable' && (
                <>
                  {changes.income.percentage > 0 ? '+' : ''}{changes.income.percentage}%
                  <span className="text-gray-500">({formatCurrency(Math.abs(changes.income.absolute))})</span>
                </>
              )}
              {changes.income.trend === 'stable' && 'No change'}
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
            {getTrendIcon(changes.expenses.trend)}
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(changes.expenses.current)}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Previous:</span>
              <span className="font-medium">{formatCurrency(changes.expenses.previous)}</span>
            </div>
            
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(changes.expenses.trend, true)}`}>
              {changes.expenses.trend !== 'stable' && (
                <>
                  {changes.expenses.percentage > 0 ? '+' : ''}{changes.expenses.percentage}%
                  <span className="text-gray-500">({formatCurrency(Math.abs(changes.expenses.absolute))})</span>
                </>
              )}
              {changes.expenses.trend === 'stable' && 'No change'}
            </div>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Savings</h3>
            {getTrendIcon(changes.savings.trend)}
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(changes.savings.current)}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Previous:</span>
              <span className="font-medium">{formatCurrency(changes.savings.previous)}</span>
            </div>
            
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(changes.savings.trend, false)}`}>
              {changes.savings.trend !== 'stable' && (
                <>
                  {changes.savings.percentage > 0 ? '+' : ''}{changes.savings.percentage}%
                  <span className="text-gray-500">({formatCurrency(Math.abs(changes.savings.absolute))})</span>
                </>
              )}
              {changes.savings.trend === 'stable' && 'No change'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Comparison Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Current</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Previous</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Change</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {changes.categories.slice(0, 10).map((cat, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{cat.category}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(cat.current)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(cat.previous)}</td>
                  <td className={`py-3 px-4 text-right font-medium ${getTrendColor(cat.trend, true)}`}>
                    {cat.percentage > 0 ? '+' : ''}{cat.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getTrendIcon(cat.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{insight.category}</div>
                  <div className="text-sm text-gray-600">{insight.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparativeAnalysis;
