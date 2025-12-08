import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Plus, Loader, RefreshCw } from 'lucide-react';
import { useTrendingStocks, useTopCryptos, useMarketSearch } from '../hooks/useMarket';
import AddInvestmentModal from './AddInvestmentModal';

const MarketExplorer = () => {
  const { stocks, loading: stocksLoading, refetch: refetchStocks } = useTrendingStocks();
  const { cryptos, loading: cryptosLoading, refetch: refetchCryptos } = useTopCryptos();
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading: searchLoading } = useMarketSearch(searchQuery);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return formatCurrency(num);
  };

  const handleAddToPortfolio = (investment) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  };

  const InvestmentCard = ({ investment, showAddButton = true }) => {
    const isPositive = investment.changePercent >= 0;
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {investment.image && (
                <img src={investment.image} alt={investment.name} className="w-6 h-6 rounded-full" />
              )}
              <h3 className="font-bold text-gray-900">{investment.name}</h3>
            </div>
            <p className="text-sm text-gray-500">{investment.symbol}</p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            investment.type === 'stock' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {investment.type === 'stock' ? 'Stock' : 'Crypto'}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(investment.currentPrice)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{investment.changePercent}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Change: {formatCurrency(investment.change)}</span>
            {investment.volume && (
              <span>Vol: {formatNumber(investment.volume)}</span>
            )}
          </div>

          {investment.marketCap && (
            <div className="text-sm text-gray-600">
              Market Cap: {formatNumber(investment.marketCap)}
            </div>
          )}
        </div>

        {showAddButton && (
          <button
            onClick={() => handleAddToPortfolio(investment)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add to Portfolio
          </button>
        )}
      </div>
    );
  };

  if (stocksLoading && cryptosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-violet-600 font-semibold">Loading market data...</p>
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
              Market Explorer 🔍
            </h1>
            <p className="text-violet-600/70">Discover and invest in stocks & cryptocurrencies</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stocks, crypto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-lg"
              />
              {searchLoading && (
                <Loader className="absolute right-4 top-1/2 transform -translate-y-1/2 text-violet-600 w-5 h-5 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {searchQuery && (results.stocks.length > 0 || results.cryptos.length > 0) && (
              <div className="mt-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                {results.stocks.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800 mb-3">Stocks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.stocks.map((stock, index) => (
                        <InvestmentCard key={index} investment={stock} />
                      ))}
                    </div>
                  </div>
                )}

                {results.cryptos.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">Cryptocurrencies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.cryptos.map((crypto, index) => (
                        <InvestmentCard key={index} investment={crypto} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trending Stocks */}
          {!searchQuery && (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">📈 Trending Stocks</h2>
                  <button
                    onClick={refetchStocks}
                    className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {stocks.map((stock, index) => (
                    <InvestmentCard key={index} investment={stock} />
                  ))}
                </div>
              </div>

              {/* Top Cryptocurrencies */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">🪙 Top Cryptocurrencies</h2>
                  <button
                    onClick={refetchCryptos}
                    className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cryptos.map((crypto, index) => (
                    <InvestmentCard key={index} investment={crypto} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Investment Modal */}
      {selectedInvestment && (
        <AddInvestmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInvestment(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedInvestment(null);
          }}
          prefilledData={{
            type: selectedInvestment.type,
            symbol: selectedInvestment.symbol,
            name: selectedInvestment.name,
            price: selectedInvestment.currentPrice,
            exchange: selectedInvestment.exchange || 'NSE'
          }}
        />
      )}
    </div>
  );
};

export default MarketExplorer;
