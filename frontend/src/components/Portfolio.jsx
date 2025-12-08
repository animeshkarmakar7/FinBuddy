import React, { useState } from 'react';
import { Plus, Wifi, WifiOff, Loader } from 'lucide-react';
import { usePortfolioSummary, useInvestments, useLivePrices } from '../hooks/useInvestments';
import PortfolioSummary from './PortfolioSummary';
import HoldingsTable from './HoldingsTable';
import AssetAllocation from './AssetAllocation';
import AddInvestmentModal from './AddInvestmentModal';

const Portfolio = () => {
  const { summary, loading: summaryLoading, refetch: refetchSummary } = usePortfolioSummary();
  const { investments, loading: investmentsLoading, refetch: refetchInvestments } = useInvestments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get symbols for WebSocket subscription
  const symbols = investments.map(inv => inv.symbol);
  const { prices: livePrices, connected } = useLivePrices(symbols);

  const loading = summaryLoading || investmentsLoading;

  const handleRefresh = () => {
    refetchSummary();
    refetchInvestments();
  };

  const handleAddSuccess = () => {
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-semibold">Loading portfolio...</p>
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
                  Portfolio 📈
                </h1>
                <p className="text-violet-600/70">Track your investments in real-time</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Connection Status */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  {connected ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Live</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Offline</span>
                    </>
                  )}
                </div>

                {/* Add Investment Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Investment
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Summary */}
          <PortfolioSummary summary={summary} livePrices={livePrices} />

          {/* Asset Allocation */}
          {summary?.assetAllocation && summary.assetAllocation.length > 0 && (
            <div className="mb-8">
              <AssetAllocation allocation={summary.assetAllocation} />
            </div>
          )}

          {/* Holdings Table */}
          <HoldingsTable 
            holdings={summary?.holdings || []}
            livePrices={livePrices}
            onRefresh={handleRefresh}
          />

          {/* Top Gainers & Losers */}
          {(summary?.topGainers?.length > 0 || summary?.topLosers?.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Top Gainers */}
              {summary.topGainers.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🚀 Top Gainers</h3>
                  <div className="space-y-3">
                    {summary.topGainers.map((gainer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">{gainer.name}</p>
                          <p className="text-sm text-gray-600">{gainer.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{gainer.returnsPercentage}%</p>
                          <p className="text-sm text-gray-600">
                            ₹{gainer.returns.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Losers */}
              {summary.topLosers.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📉 Top Losers</h3>
                  <div className="space-y-3">
                    {summary.topLosers.map((loser, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">{loser.name}</p>
                          <p className="text-sm text-gray-600">{loser.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{loser.returnsPercentage}%</p>
                          <p className="text-sm text-gray-600">
                            ₹{Math.abs(loser.returns).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Investment Modal */}
      <AddInvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
