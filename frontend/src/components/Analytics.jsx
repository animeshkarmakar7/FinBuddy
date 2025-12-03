import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Loader,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Home,
  Car,
  Utensils,
  ShoppingBag,
  Coffee,
  Smartphone,
  Heart,
  Zap,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, transactionsRes] = await Promise.all([
        transactionAPI.getStats(),
        transactionAPI.getAll(),
      ]);

      setStats(statsRes.data || {});
      setTransactions(transactionsRes.data || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      ShoppingBag,
      Coffee,
      Home,
      Car,
      Smartphone,
      Utensils,
      Heart,
      Zap,
      DollarSign,
    };
    return icons[iconName] || DollarSign;
  };

  // Calculate financial overview
  const financialOverview = {
    totalIncome: stats?.totalIncome || 0,
    totalExpense: stats?.totalExpense || 0,
    netSavings: (stats?.totalIncome || 0) - (stats?.totalExpense || 0),
    savingsRate: stats?.totalIncome > 0 
      ? (((stats?.totalIncome - stats?.totalExpense) / stats?.totalIncome) * 100).toFixed(1)
      : 0,
  };

  // Calculate trend percentages from actual monthly data
  const calculateTrendPercentage = (type) => {
    if (!stats?.byMonth) return 0;
    
    const months = Object.entries(stats.byMonth);
    if (months.length < 2) return 0;
    
    const currentMonth = months[months.length - 1][1];
    const previousMonth = months[months.length - 2][1];
    
    const current = currentMonth[type] || 0;
    const previous = previousMonth[type] || 0;
    
    if (previous === 0) return current > 0 ? 100 : 0;
    
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Calculate savings trend
  const calculateSavingsTrend = () => {
    if (!stats?.byMonth) return 0;
    
    const months = Object.entries(stats.byMonth);
    if (months.length < 2) return 0;
    
    const currentMonth = months[months.length - 1][1];
    const previousMonth = months[months.length - 2][1];
    
    const currentSavings = (currentMonth.income || 0) - (currentMonth.expense || 0);
    const previousSavings = (previousMonth.income || 0) - (previousMonth.expense || 0);
    
    if (previousSavings === 0) return currentSavings > 0 ? 100 : 0;
    
    return ((currentSavings - previousSavings) / Math.abs(previousSavings) * 100).toFixed(1);
  };

  // Get savings rate assessment
  const getSavingsRateAssessment = (rate) => {
    if (rate >= 30) return 'Excellent';
    if (rate >= 20) return 'Great';
    if (rate >= 10) return 'Good';
    if (rate >= 5) return 'Fair';
    return 'Needs Improvement';
  };

  const incomeTrend = calculateTrendPercentage('income');
  const expenseTrend = calculateTrendPercentage('expense');
  const savingsTrend = calculateSavingsTrend();

  // Summary cards with real trends
  const summaryCards = [
    {
      id: 1,
      title: 'Total Income',
      value: `$${financialOverview.totalIncome.toLocaleString()}`,
      change: `${incomeTrend >= 0 ? '+' : ''}${incomeTrend}%`,
      trend: incomeTrend >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 2,
      title: 'Total Expenses',
      value: `$${financialOverview.totalExpense.toLocaleString()}`,
      change: `${expenseTrend >= 0 ? '+' : ''}${expenseTrend}%`,
      trend: expenseTrend >= 0 ? 'up' : 'down',
      icon: TrendingDown,
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Net Savings',
      value: `$${financialOverview.netSavings.toLocaleString()}`,
      change: `${savingsTrend >= 0 ? '+' : ''}${savingsTrend}%`,
      trend: savingsTrend >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 4,
      title: 'Savings Rate',
      value: `${financialOverview.savingsRate}%`,
      change: getSavingsRateAssessment(financialOverview.savingsRate),
      trend: 'up',
      icon: Target,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  // Income vs Expense over time from real data
  const incomeExpenseData = stats?.byMonth
    ? Object.entries(stats.byMonth).map(([month, data]) => ({
        month,
        income: data.income || 0,
        expense: data.expense || 0,
        savings: (data.income || 0) - (data.expense || 0),
      }))
    : [];

  // Spending by category from real data
  const spendingByCategory = stats?.byCategory
    ? Object.entries(stats.byCategory)
        .filter(([_, data]) => data.type === 'expense')
        .map(([category, data], index) => {
          const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#a855f7', '#6b7280'];
          const icons = [Home, Car, Utensils, ShoppingBag, Coffee, Heart, Zap, DollarSign];
          return {
            category,
            amount: data.total,
            percentage: stats.totalExpense > 0 ? ((data.total / stats.totalExpense) * 100).toFixed(1) : 0,
            color: colors[index % colors.length],
            icon: icons[index % icons.length],
          };
        })
    : [];

  // Income sources from real data
  const incomeSources = stats?.byCategory
    ? Object.entries(stats.byCategory)
        .filter(([_, data]) => data.type === 'income')
        .map(([source, data], index) => {
          const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];
          return {
            source,
            amount: data.total,
            percentage: stats.totalIncome > 0 ? ((data.total / stats.totalIncome) * 100).toFixed(1) : 0,
            color: colors[index % colors.length],
          };
        })
    : [];

  // Top expenses from real transactions
  const topExpenses = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(t => ({
      name: t.merchant,
      category: t.category,
      amount: t.amount,
      date: new Date(t.date).toLocaleDateString(),
      icon: getIconComponent(t.icon),
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <p className="text-rose-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      <div className="lg:ml-72 transition-all duration-500 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mt-16 lg:mt-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 animate-fade-in">
                  Analytics 📊
                </h1>
                <p className="text-violet-600/70">Detailed insights into your financial health</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`relative overflow-hidden bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`,
                    opacity: 0
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                  </div>

                  <div className="relative z-10">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-white/80 text-sm mb-2">{card.title}</p>
                    <h3 className="text-3xl font-bold mb-2">{card.value}</h3>
                    <div className="flex items-center gap-2">
                      {card.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">{card.change}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Income vs Expense Chart */}
          {incomeExpenseData.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-violet-800 mb-1">Income vs Expense Trend</h3>
                  <p className="text-sm text-violet-600/70">Monthly comparison</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={incomeExpenseData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="month" stroke="#8b5cf6" />
                  <YAxis stroke="#8b5cf6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #c4b5fd',
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#f43f5e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Spending Breakdown & Income Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spending by Category */}
            {spendingByCategory.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
                <h3 className="text-xl font-bold text-violet-800 mb-6">Spending by Category</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="amount"
                      animationDuration={1000}
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #c4b5fd',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2 mt-4">
                  {spendingByCategory.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.category} className="flex items-center justify-between p-2 hover:bg-violet-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <Icon className="w-4 h-4 text-violet-600" />
                          <span className="text-sm text-violet-700">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-violet-800">
                            ${item.amount.toLocaleString()}
                          </span>
                          <span className="text-xs text-violet-600/70 ml-2">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Income Sources */}
            {incomeSources.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
                <h3 className="text-xl font-bold text-violet-800 mb-6">Income Sources</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={incomeSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="amount"
                      animationDuration={1000}
                    >
                      {incomeSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #c4b5fd',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3 mt-4">
                  {incomeSources.map((item) => (
                    <div key={item.source} className="flex items-center justify-between p-3 bg-violet-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-violet-700">{item.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-violet-800">
                          ${item.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-violet-600/70">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Expenses */}
          {topExpenses.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Top Expenses</h3>

              <div className="space-y-3">
                {topExpenses.map((expense, index) => {
                  const Icon = expense.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-violet-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-violet-800">{expense.name}</p>
                          <p className="text-sm text-violet-600/70">
                            {expense.category} • {expense.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-600 text-lg">
                          -${expense.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
