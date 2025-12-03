import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import AddTransactionModal from './AddTransactionModal';
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Plus,
  Loader,
  AlertCircle,
  Activity,
  BarChart3,
  Briefcase,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Investments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  
  // Real data state
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const fetchInvestmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsRes, statsRes] = await Promise.all([
        transactionAPI.getAll({ type: 'investment' }),
        transactionAPI.getStats(),
      ]);

      // Filter only investment transactions
      const investmentTransactions = (transactionsRes.data || []).filter(
        t => t.type === 'investment'
      );
      setInvestments(investmentTransactions);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error('Error fetching investment data:', err);
      setError('Failed to load investment data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate investment categories from stats
  const investmentCategories = stats?.byCategory
    ? Object.entries(stats.byCategory)
        .filter(([_, data]) => data.type === 'investment')
        .map(([category, data], index) => ({
          name: category,
          value: data.total,
          count: data.count,
          color: ['from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500', 'from-cyan-500 to-teal-500', 'from-pink-500 to-rose-500'][index % 4],
          icon: [Activity, BarChart3, TrendingUp, Briefcase][index % 4],
        }))
    : [];

  // Calculate monthly performance
  const performanceData = stats?.byMonth
    ? Object.entries(stats.byMonth).map(([month, data]) => ({
        date: month,
        value: data.investment || 0,
      }))
    : [];

  const totalInvestment = stats?.totalInvestment || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-semibold">Loading investments...</p>
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
            onClick={fetchInvestmentData}
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
                  Investment Portfolio 📈
                </h1>
                <p className="text-violet-600/70">Track and manage your investments</p>
              </div>
              <button 
                onClick={() => setShowAddInvestment(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Investment
              </button>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">Portfolio</span>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-2">Total Investment Value</p>
              <h2 className="text-4xl font-bold mb-4">${totalInvestment.toLocaleString()}</h2>
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/70 text-xs mb-1">Total Investments</p>
                  <p className="text-lg font-bold">{investments.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs mb-1">Categories</p>
                  <p className="text-lg font-bold">{investmentCategories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-violet-600/70 text-sm mb-2">Active Investments</p>
              <h3 className="text-3xl font-bold text-violet-800 mb-2">{investments.length}</h3>
              <p className="text-sm text-emerald-600 font-semibold">Across {investmentCategories.length} categories</p>
            </div>
          </div>

          {/* Performance Chart */}
          {performanceData.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-violet-800 mb-1">Investment Performance</h3>
                  <p className="text-sm text-violet-600/70">Track your investment growth over time</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="date" stroke="#8b5cf6" />
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
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#portfolioGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Investment Categories */}
          {investmentCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-violet-800 mb-6">Investment Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {investmentCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.name}
                      className={`group relative overflow-hidden bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`,
                        opacity: 0
                      }}
                    >
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>

                        <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
                        <p className="text-3xl font-bold mb-3">${category.value.toLocaleString()}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/20">
                          <div className="text-sm text-white/80">
                            {category.count} {category.count === 1 ? 'investment' : 'investments'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Investment List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-violet-800">Your Investments</h3>
            </div>

            {investments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-violet-300 mx-auto mb-4" />
                <p className="text-violet-600/70 mb-4">No investments yet</p>
                <button
                  onClick={() => setShowAddInvestment(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Add Your First Investment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {investments.map((investment, index) => (
                  <div
                    key={investment._id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-violet-50/50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-violet-200"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-violet-800">{investment.merchant}</p>
                          <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full">
                            {investment.category}
                          </span>
                        </div>
                        <p className="text-sm text-violet-600/70">
                          {new Date(investment.date).toLocaleDateString()} • {investment.status}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-violet-800">${investment.amount.toLocaleString()}</p>
                      <p className="text-xs text-violet-600/70 capitalize">{investment.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Investment Modal */}
      <AddTransactionModal
        isOpen={showAddInvestment}
        onClose={() => setShowAddInvestment(false)}
        onSuccess={fetchInvestmentData}
        type="investment"
      />

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
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Investments;
