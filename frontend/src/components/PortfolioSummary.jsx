import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import IndianRupee from './icons/IndianRupee';

const PortfolioSummary = ({ summary, livePrices }) => {
  if (!summary) return null;

  const cards = [
    {
      title: 'Total Invested',
      value: summary.totalInvested,
      icon: IndianRupee,
      color: 'from-blue-500 to-cyan-500',
      change: null
    },
    {
      title: 'Current Value',
      value: summary.currentValue,
      icon: Activity,
      color: 'from-violet-500 to-purple-500',
      change: null
    },
    {
      title: 'Total Returns',
      value: summary.totalReturns,
      icon: summary.totalReturns >= 0 ? TrendingUp : TrendingDown,
      color: summary.totalReturns >= 0 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-pink-500',
      change: summary.returnsPercentage
    },
    {
      title: "Today's P&L",
      value: summary.todaysPL || 0,
      icon: summary.todaysPL >= 0 ? TrendingUp : TrendingDown,
      color: summary.todaysPL >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500',
      change: null
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.value >= 0;
        
        return (
          <div
            key={index}
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
              
              <h3 className="text-3xl font-bold mb-2">
                {formatCurrency(card.value)}
              </h3>
              
              {card.change !== null && (
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {isPositive ? '+' : ''}{card.change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
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
      `}</style>
    </div>
  );
};

export default PortfolioSummary;
