import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AssetAllocation = ({ allocation }) => {
  if (!allocation || allocation.length === 0) {
    return null;
  }

  const COLORS = {
    stock: '#3b82f6',
    mutual_fund: '#8b5cf6',
    crypto: '#f59e0b',
    fd: '#10b981',
    gold: '#eab308',
    bond: '#6366f1'
  };

  const LABELS = {
    stock: 'Stocks',
    mutual_fund: 'Mutual Funds',
    crypto: 'Crypto',
    fd: 'Fixed Deposits',
    gold: 'Gold',
    bond: 'Bonds'
  };

  const data = allocation.map(item => ({
    name: LABELS[item.type] || item.type,
    value: item.value,
    percentage: parseFloat(item.percentage),
    color: COLORS[item.type] || '#6b7280'
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-violet-600 font-bold">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Asset Allocation</h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-3">
          {data.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(item.value)}</p>
                <p className="text-sm text-gray-600">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
