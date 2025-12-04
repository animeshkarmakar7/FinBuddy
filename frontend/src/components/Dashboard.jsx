import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AddTransactionModal from './AddTransactionModal';
import AICoach from './AICoach';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  Loader,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  Smartphone,
  Utensils,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  
  // Real data state
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
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
      DollarSign,
      TrendingUp,
      TrendingDown,
    };
    return icons[iconName] || DollarSign;
  };

  // Calculate portfolio distribution from stats
  const portfolioData = stats?.byCategory
    ? Object.entries(stats.byCategory)
        .filter(([_, data]) => data.type === 'investment')
        .map(([category, data], index) => ({
          name: category,
          value: data.total,
          color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#a855f7', '#ec4899'][index % 5],
        }))
    : [];

  // Calculate monthly trend from stats
  const trendData = stats?.byMonth
    ? Object.entries(stats.byMonth).map(([month, data]) => ({
        month,
        value: (data.income || 0) - (data.expense || 0) + (data.investment || 0),
      }))
    : [];

  // Calculate trend percentages from actual data
  const calculateTrendPercentage = (currentValue, type) => {
    if (!stats?.byMonth) return 0;
    
    const months = Object.entries(stats.byMonth);
    if (months.length < 2) return 0;
    
    // Get current month and previous month data
    const currentMonth = months[months.length - 1][1];
    const previousMonth = months[months.length - 2][1];
    
    const current = currentMonth[type] || 0;
    const previous = previousMonth[type] || 0;
    
    if (previous === 0) return current > 0 ? 100 : 0;
    
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Calculate net worth trend
  const calculateNetWorthTrend = () => {
    if (!stats?.byMonth) return 0;
    
    const months = Object.entries(stats.byMonth);
    if (months.length < 2) return 0;
    
    const currentMonth = months[months.length - 1][1];
    const previousMonth = months[months.length - 2][1];
    
    const currentNet = (currentMonth.income || 0) - (currentMonth.expense || 0) + (currentMonth.investment || 0);
    const previousNet = (previousMonth.income || 0) - (previousMonth.expense || 0) + (previousMonth.investment || 0);
    
    if (previousNet === 0) return currentNet > 0 ? 100 : 0;
    
    return ((currentNet - previousNet) / Math.abs(previousNet) * 100).toFixed(1);
  };

  // Balance cards data from real stats with calculated trends
  const balanceCards = [
    {
      title: 'Total Balance',
      amount: stats?.netWorth || 0,
      change: Math.abs(calculateNetWorthTrend()),
      icon: Wallet,
      gradient: 'from-blue-500 via-violet-500 to-purple-600',
      trend: calculateNetWorthTrend() >= 0 ? 'up' : 'down'
    },
    {
      title: 'Investments',
      amount: stats?.totalInvestment || 0,
      change: Math.abs(calculateTrendPercentage(stats?.totalInvestment, 'investment')),
      icon: TrendingUp,
      gradient: 'from-violet-500 via-purple-500 to-pink-600',
      trend: calculateTrendPercentage(stats?.totalInvestment, 'investment') >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Income',
      amount: stats?.totalIncome || 0,
      change: Math.abs(calculateTrendPercentage(stats?.totalIncome, 'income')),
      icon: DollarSign,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      trend: calculateTrendPercentage(stats?.totalIncome, 'income') >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Expenses',
      amount: stats?.totalExpense || 0,
      change: Math.abs(calculateTrendPercentage(stats?.totalExpense, 'expense')),
      icon: TrendingDown,
      gradient: 'from-rose-500 via-pink-500 to-red-600',
      trend: calculateTrendPercentage(stats?.totalExpense, 'expense') >= 0 ? 'up' : 'down'
    }
  ];

  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const handleAddTransaction = (type) => {
    setTransactionType(type);
    setShowAddTransaction(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-semibold">Loading dashboard...</p>
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
            onClick={fetchDashboardData}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 animate-fade-in">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-violet-600/70 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last updated: Just now
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAICoach(true)}
                  className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  AI Coach
                </button>
                <button 
                  onClick={() => handleAddTransaction('expense')}
                  className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {balanceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer animate-slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      {card.title === 'Total Balance' && (
                        <button
                          onClick={() => setBalanceVisible(!balanceVisible)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      )}
                    </div>

                    <p className="text-white/80 text-sm mb-2">{card.title}</p>
                    <h3 className="text-3xl font-bold mb-3">
                      {balanceVisible ? `$${card.amount.toLocaleString()}` : '••••••'}
                    </h3>

                    <div className="flex items-center gap-2">
                      {card.trend === 'up' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                      <span className="text-sm font-semibold">
                        {card.trend === 'up' ? '+' : '-'}{card.change}% this month
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Investment Trend Chart */}
            {trendData.length > 0 && (
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-violet-800 mb-1">Net Worth Trend</h3>
                    <p className="text-sm text-violet-600/70">Monthly performance</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                    <XAxis dataKey="month" stroke="#8b5cf6" />
                    <YAxis stroke="#8b5cf6" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #c4b5fd',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(139, 92, 246, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Portfolio Distribution */}
            {portfolioData.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-bold text-violet-800 mb-1">Investments</h3>
                <p className="text-sm text-violet-600/70 mb-6">By category</p>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {portfolioData.map((entry, index) => (
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
                  {portfolioData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-violet-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-violet-800">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAddTransaction('income')}
                  className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm font-semibold">Add Income</p>
                </button>

                <button
                  onClick={() => handleAddTransaction('expense')}
                  className="group relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-500 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm font-semibold">Add Expense</p>
                </button>

                <button
                  onClick={() => handleAddTransaction('investment')}
                  className="group relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-500 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm font-semibold">Add Investment</p>
                </button>

                <button
                  onClick={() => window.location.href = '#wallet'}
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <Wallet className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm font-semibold">View Wallet</p>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-violet-800">Recent Transactions</h3>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-violet-300 mx-auto mb-4" />
                  <p className="text-violet-600/70 mb-4">No transactions yet</p>
                  <button
                    onClick={() => handleAddTransaction('expense')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Add Your First Transaction
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction, index) => {
                    const Icon = getIconComponent(transaction.icon);
                    return (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-violet-50/50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-violet-200"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              transaction.type === 'income'
                                ? 'bg-emerald-100 text-emerald-600'
                                : transaction.type === 'investment'
                                ? 'bg-violet-100 text-violet-600'
                                : 'bg-rose-100 text-rose-600'
                            } group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-violet-800">{transaction.merchant}</p>
                            <p className="text-sm text-violet-600/70">
                              {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-bold ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSuccess={fetchDashboardData}
        type={transactionType}
      />

      {/* AI Coach Modal */}
      {showAICoach && (
        <AICoach onClose={() => setShowAICoach(false)} />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
