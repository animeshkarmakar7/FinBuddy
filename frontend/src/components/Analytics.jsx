import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
  Zap,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Coffee,
  Smartphone,
  Heart,
  Plane,
  Film
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedYear, setSelectedYear] = useState('2023');

  // Financial overview data
  const financialOverview = {
    totalIncome: 28500,
    totalExpense: 18200,
    netSavings: 10300,
    savingsRate: 36.1,
    budgetUtilization: 72.8,
    financialHealthScore: 85
  };

  // Summary cards
  const summaryCards = [
    {
      id: 1,
      title: 'Total Income',
      value: `$${financialOverview.totalIncome.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 2,
      title: 'Total Expenses',
      value: `$${financialOverview.totalExpense.toLocaleString()}`,
      change: '-8.3%',
      trend: 'down',
      icon: TrendingDown,
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Net Savings',
      value: `$${financialOverview.netSavings.toLocaleString()}`,
      change: '+24.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 4,
      title: 'Savings Rate',
      value: `${financialOverview.savingsRate}%`,
      change: 'Excellent',
      trend: 'up',
      icon: Target,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  // Income vs Expense over time
  const incomeExpenseData = [
    { month: 'Jan', income: 7200, expense: 5800, savings: 1400 },
    { month: 'Feb', income: 7500, expense: 6100, savings: 1400 },
    { month: 'Mar', income: 8200, expense: 5900, savings: 2300 },
    { month: 'Apr', income: 7800, expense: 6400, savings: 1400 },
    { month: 'May', income: 8500, expense: 6200, savings: 2300 },
    { month: 'Jun', income: 8800, expense: 6500, savings: 2300 },
    { month: 'Jul', income: 9200, expense: 6800, savings: 2400 },
    { month: 'Aug', income: 8900, expense: 6300, savings: 2600 },
    { month: 'Sep', income: 9500, expense: 6700, savings: 2800 }
  ];

  // Spending by category
  const spendingByCategory = [
    { category: 'Housing', amount: 4500, percentage: 24.7, color: '#3b82f6', icon: Home },
    { category: 'Transportation', amount: 2800, percentage: 15.4, color: '#8b5cf6', icon: Car },
    { category: 'Food & Dining', amount: 3200, percentage: 17.6, color: '#06b6d4', icon: Utensils },
    { category: 'Shopping', amount: 2100, percentage: 11.5, color: '#ec4899', icon: ShoppingBag },
    { category: 'Entertainment', amount: 1800, percentage: 9.9, color: '#f59e0b', icon: Film },
    { category: 'Healthcare', amount: 1500, percentage: 8.2, color: '#10b981', icon: Heart },
    { category: 'Utilities', amount: 1200, percentage: 6.6, color: '#a855f7', icon: Zap },
    { category: 'Other', amount: 1100, percentage: 6.0, color: '#6b7280', icon: Activity }
  ];

  // Income sources
  const incomeSources = [
    { source: 'Salary', amount: 18500, percentage: 64.9, color: '#3b82f6' },
    { source: 'Investments', amount: 6200, percentage: 21.8, color: '#8b5cf6' },
    { source: 'Freelance', amount: 2800, percentage: 9.8, color: '#06b6d4' },
    { source: 'Other', amount: 1000, percentage: 3.5, color: '#10b981' }
  ];

  // Budget vs Actual
  const budgetComparison = [
    { category: 'Housing', budget: 5000, actual: 4500 },
    { category: 'Food', budget: 3500, actual: 3200 },
    { category: 'Transport', budget: 3000, actual: 2800 },
    { category: 'Shopping', budget: 2000, actual: 2100 },
    { category: 'Entertainment', budget: 1500, actual: 1800 },
    { category: 'Healthcare', budget: 1500, actual: 1500 }
  ];

  // Monthly trends
  const monthlyTrends = [
    { month: 'Jan', value: 5800 },
    { month: 'Feb', value: 6100 },
    { month: 'Mar', value: 5900 },
    { month: 'Apr', value: 6400 },
    { month: 'May', value: 6200 },
    { month: 'Jun', value: 6500 },
    { month: 'Jul', value: 6800 },
    { month: 'Aug', value: 6300 },
    { month: 'Sep', value: 6700 }
  ];

  // Financial health metrics
  const healthMetrics = [
    { metric: 'Savings', value: 85 },
    { metric: 'Debt', value: 70 },
    { metric: 'Investment', value: 90 },
    { metric: 'Budget', value: 75 },
    { metric: 'Emergency Fund', value: 80 }
  ];

  // Top expenses
  const topExpenses = [
    { name: 'Rent Payment', category: 'Housing', amount: 2500, date: 'Sep 1', icon: Home },
    { name: 'Car Payment', category: 'Transportation', amount: 850, date: 'Sep 5', icon: Car },
    { name: 'Grocery Shopping', category: 'Food', amount: 420, date: 'Sep 10', icon: ShoppingBag },
    { name: 'Restaurant Dinner', category: 'Dining', amount: 180, date: 'Sep 12', icon: Utensils },
    { name: 'Gas Station', category: 'Transportation', amount: 120, date: 'Sep 15', icon: Car }
  ];

  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year', 'All Time'];
  const years = ['2023', '2022', '2021', '2020'];

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
              <div className="flex gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 bg-white border border-violet-200 rounded-xl text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
                <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-violet-800 mb-1">Income vs Expense Trend</h3>
                <p className="text-sm text-violet-600/70">Monthly comparison over the year</p>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-violet-50 border border-violet-200 rounded-lg text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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

          {/* Spending Breakdown & Income Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spending by Category */}
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

            {/* Income Sources */}
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
          </div>

          {/* Budget vs Actual & Financial Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Budget Comparison */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Budget vs Actual Spending</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="category" stroke="#8b5cf6" />
                  <YAxis stroke="#8b5cf6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #c4b5fd',
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#8b5cf6" radius={[8, 8, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="actual" fill="#3b82f6" radius={[8, 8, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Financial Health Score */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Financial Health Score</h3>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e9d5ff"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#healthGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(financialOverview.financialHealthScore / 100) * 440} 440`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-violet-800">
                      {financialOverview.financialHealthScore}
                    </span>
                    <span className="text-sm text-violet-600/70">Score</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={healthMetrics}>
                  <PolarGrid stroke="#e9d5ff" />
                  <PolarAngleAxis dataKey="metric" stroke="#8b5cf6" />
                  <PolarRadiusAxis stroke="#8b5cf6" />
                  <Radar
                    name="Health"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    animationDuration={1000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Expenses */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
            <h3 className="text-xl font-bold text-violet-800 mb-6">Top Expenses This Month</h3>

            <div className="space-y-3">
              {topExpenses.map((expense, index) => {
                const Icon = expense.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-violet-200"
                    style={{
                      animation: `slideInRight 0.5s ease-out ${index * 80}ms forwards`,
                      opacity: 0
                    }}
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
        </div>
      </div>

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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
