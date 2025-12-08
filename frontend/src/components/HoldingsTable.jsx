import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const HoldingsTable = ({ holdings, livePrices, onRefresh }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(num);
  };

  const getAssetTypeLabel = (type) => {
    const labels = {
      stock: 'Stock',
      mutual_fund: 'Mutual Fund',
      crypto: 'Crypto',
      fd: 'Fixed Deposit',
      gold: 'Gold',
      bond: 'Bond'
    };
    return labels[type] || type;
  };

  const getAssetTypeBadge = (type) => {
    const colors = {
      stock: 'bg-blue-100 text-blue-800',
      mutual_fund: 'bg-purple-100 text-purple-800',
      crypto: 'bg-orange-100 text-orange-800',
      fd: 'bg-green-100 text-green-800',
      gold: 'bg-yellow-100 text-yellow-800',
      bond: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
        <p className="text-gray-500 text-lg">No investments yet</p>
        <p className="text-gray-400 text-sm mt-2">Add your first investment to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Holdings</h3>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Asset</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Qty</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Avg Price</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Current Price</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Invested</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Current Value</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">P&L</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Returns %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              // Use live price if available
              const currentPrice = livePrices[holding.symbol] || holding.currentPrice;
              const currentValue = holding.quantity * currentPrice;
              const returns = currentValue - holding.totalInvested;
              const returnsPercentage = holding.totalInvested > 0 
                ? ((returns / holding.totalInvested) * 100).toFixed(2)
                : 0;
              
              const isProfit = returns >= 0;

              return (
                <tr 
                  key={holding.id || index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-800">{holding.name}</p>
                      <p className="text-sm text-gray-500">{holding.symbol}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAssetTypeBadge(holding.type)}`}>
                      {getAssetTypeLabel(holding.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-900">
                    {formatNumber(holding.quantity)}
                  </td>
                  <td className="py-4 px-6 text-right text-gray-900">
                    {formatCurrency(holding.avgBuyPrice)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-900">{formatCurrency(currentPrice)}</span>
                      {livePrices[holding.symbol] && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-900">
                    {formatCurrency(holding.totalInvested)}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {formatCurrency(currentValue)}
                  </td>
                  <td className={`py-4 px-6 text-right font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatCurrency(Math.abs(returns))}
                    </div>
                  </td>
                  <td className={`py-4 px-6 text-right font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {isProfit ? '+' : ''}{returnsPercentage}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
