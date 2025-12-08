import React, { useState, useEffect } from 'react';
import IndianRupee from './icons/IndianRupee';
import { transactionAPI, paymentMethodAPI } from '../services/api';
import AddTransactionModal from './AddTransactionModal';
import AddPaymentMethodModal from './AddPaymentMethodModal';
import {
  Wallet as WalletIcon,
  CreditCard,
  Send,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  Smartphone,
  Utensils,

  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Wallet = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  
  // State for real data
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [stats, setStats] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [transactionsRes, paymentMethodsRes, statsRes] = await Promise.all([
        transactionAPI.getAll(),
        paymentMethodAPI.getAll(),
        transactionAPI.getStats(),
      ]);

      setTransactions(transactionsRes.data || []);
      setPaymentMethods(paymentMethodsRes.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate wallet balance from stats
  const walletBalance = {
    total: stats?.netWorth || 0,
    available: stats?.availableBalance || 0,
    pending: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    monthlyIncome: stats?.totalIncome || 0,
    monthlyExpense: stats?.totalExpense || 0,
  };

  // Calculate spending by category
  const spendingData = stats?.byCategory
    ? Object.entries(stats.byCategory)
        .filter(([_, data]) => data.type === 'expense')
        .map(([category, data], index) => ({
          category,
          amount: data.total,
          color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#a855f7', '#ec4899'][index % 5],
        }))
    : [];

  // Calculate monthly trend
  const monthlyTrend = stats?.byMonth
    ? Object.entries(stats.byMonth).map(([month, data]) => ({
        month,
        income: data.income || 0,
        expense: data.expense || 0,
      }))
    : [];

  const filters = ['All', 'Income', 'Expense', 'Pending'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-violet-500" />;
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
      IndianRupee,
      TrendingUp,
      TrendingDown,
    };
    return icons[iconName] || IndianRupee;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Income') return transaction.type === 'income';
    if (selectedFilter === 'Expense') return transaction.type === 'expense';
    if (selectedFilter === 'Pending') return transaction.status === 'pending';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-semibold">Loading wallet data...</p>
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
            onClick={fetchWalletData}
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
                  My Wallet 💳
                </h1>
                <p className="text-violet-600/70">Manage your finances and transactions</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddTransaction(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Transaction
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-violet-600 border border-violet-200 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Download className="w-5 h-5" />
                  Receive
                </button>
              </div>
            </div>
          </div>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <WalletIcon className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-white/80 text-sm mb-2">Total Balance</p>
              <h2 className="text-5xl font-bold mb-6">
                {balanceVisible ? `$${walletBalance.total.toLocaleString()}` : '••••••'}
              </h2>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/70 text-xs mb-1">Available</p>
                  <p className="text-xl font-bold">
                    {balanceVisible ? `$${walletBalance.available.toLocaleString()}` : '••••••'}
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-xs mb-1">Pending</p>
                  <p className="text-xl font-bold">
                    {balanceVisible ? `$${walletBalance.pending.toLocaleString()}` : '••••••'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-sm font-semibold text-violet-600/70 mb-4">This Month</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Download className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-violet-700">Income</span>
                    </div>
                    <span className="font-bold text-emerald-600">
                      +${walletBalance.monthlyIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-rose-100 rounded-lg">
                        <Send className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="text-sm text-violet-700">Expense</span>
                    </div>
                    <span className="font-bold text-rose-600">
                      -${walletBalance.monthlyExpense.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-violet-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-violet-700">Net Savings</span>
                    <span className="font-bold text-violet-800">
                      ${(walletBalance.monthlyIncome - walletBalance.monthlyExpense).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          {paymentMethods.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-violet-800">Payment Methods</h3>
                <button 
                  onClick={() => setShowAddPaymentMethod(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paymentMethods.map((method, index) => (
                  <div
                    key={method._id}
                    className={`relative overflow-hidden bg-gradient-to-br ${method.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}
                  >
                    {method.isDefault && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">
                        Default
                      </div>
                    )}

                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <CreditCard className="w-8 h-8" />
                      </div>

                      <div className="mb-6">
                        <p className="text-white/70 text-sm mb-1">{method.type}</p>
                        <p className="text-xl font-bold mb-1">{method.name}</p>
                        <p className="text-white/90 font-mono">{method.number}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <span className="text-white/70 text-sm">Balance</span>
                        <span className="text-xl font-bold">${method.balance.toLocaleString()}</span>
                      </div>

                      {method.limit && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/70">Credit Used</span>
                            <span>{Math.round((method.balance / method.limit) * 100)}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(method.balance / method.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics & Transactions */}
          {spendingData.length > 0 && monthlyTrend.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Spending by Category */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
                <h3 className="text-xl font-bold text-violet-800 mb-6">Spending by Category</h3>

                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                      animationDuration={1000}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2 mt-4">
                  {spendingData.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-violet-700">{item.category}</span>
                      </div>
                      <span className="text-sm font-semibold text-violet-800">
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
                <h3 className="text-xl font-bold text-violet-800 mb-6">Income vs Expense</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                    <XAxis dataKey="month" stroke="#8b5cf6" />
                    <YAxis stroke="#8b5cf6" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-violet-800">Transaction History</h3>
              <div className="flex gap-2">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-violet-50 border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="flex gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFilter === filter
                          ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md'
                          : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-violet-300 mx-auto mb-4" />
                <p className="text-violet-600/70">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction, index) => {
                  const Icon = getIconComponent(transaction.icon);
                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-violet-50/50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-violet-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-xl bg-${transaction.color}-100 text-${transaction.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-violet-800">{transaction.merchant}</p>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <p className="text-sm text-violet-600/70">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()} at {transaction.time}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-violet-600/70 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSuccess={fetchWalletData}
        type="expense"
      />
      
      <AddPaymentMethodModal
        isOpen={showAddPaymentMethod}
        onClose={() => setShowAddPaymentMethod(false)}
        onSuccess={fetchWalletData}
      />
    </div>
  );
};

export default Wallet;
