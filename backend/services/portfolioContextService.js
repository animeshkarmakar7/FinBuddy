import Investment from '../models/Investment.js';

class PortfolioContextService {
  /**
   * Get user's portfolio context for AI
   */
  async getPortfolioContext(userId) {
    try {
      // Fetch user's investments
      const investments = await Investment.find({ userId }).lean();
      
      if (!investments || investments.length === 0) {
        return {
          hasPortfolio: false,
          message: 'No portfolio data available'
        };
      }
      
      // Calculate portfolio metrics
      const totalValue = investments.reduce((sum, inv) => {
        const currentValue = inv.quantity * inv.currentPrice;
        return sum + currentValue;
      }, 0);
      
      const totalInvested = investments.reduce((sum, inv) => {
        return sum + inv.totalInvested;
      }, 0);
      
      const totalPnL = totalValue - totalInvested;
      const pnlPercentage = ((totalPnL / totalInvested) * 100).toFixed(2);
      
      // Get top performers
      const sortedByPnL = [...investments].sort((a, b) => {
        const pnlA = ((a.currentPrice - a.averagePrice) / a.averagePrice) * 100;
        const pnlB = ((b.currentPrice - b.averagePrice) / b.averagePrice) * 100;
        return pnlB - pnlA;
      });
      
      const topGainers = sortedByPnL.slice(0, 3).map(inv => ({
        symbol: inv.symbol,
        name: inv.name,
        pnl: (((inv.currentPrice - inv.averagePrice) / inv.averagePrice) * 100).toFixed(2),
        value: (inv.quantity * inv.currentPrice).toFixed(2)
      }));
      
      const topLosers = sortedByPnL.slice(-3).reverse().map(inv => ({
        symbol: inv.symbol,
        name: inv.name,
        pnl: (((inv.currentPrice - inv.averagePrice) / inv.averagePrice) * 100).toFixed(2),
        value: (inv.quantity * inv.currentPrice).toFixed(2)
      }));
      
      // Asset allocation
      const assetAllocation = {};
      investments.forEach(inv => {
        const value = inv.quantity * inv.currentPrice;
        assetAllocation[inv.type] = (assetAllocation[inv.type] || 0) + value;
      });
      
      const allocationPercentages = {};
      Object.keys(assetAllocation).forEach(type => {
        allocationPercentages[type] = ((assetAllocation[type] / totalValue) * 100).toFixed(2);
      });
      
      return {
        hasPortfolio: true,
        totalValue: totalValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        totalPnL: totalPnL.toFixed(2),
        pnlPercentage,
        holdingsCount: investments.length,
        topGainers,
        topLosers,
        assetAllocation: allocationPercentages,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting portfolio context:', error);
      return {
        hasPortfolio: false,
        error: error.message
      };
    }
  }
  
  /**
   * Format portfolio context for AI prompt
   */
  formatForAI(context) {
    if (!context.hasPortfolio) {
      return 'User has no portfolio data yet.';
    }
    
    let prompt = `USER'S PORTFOLIO SUMMARY:\n`;
    prompt += `Total Portfolio Value: ₹${context.totalValue}\n`;
    prompt += `Total Invested: ₹${context.totalInvested}\n`;
    prompt += `Overall P&L: ${context.pnlPercentage}% (₹${context.totalPnL})\n`;
    prompt += `Number of Holdings: ${context.holdingsCount}\n\n`;
    
    if (context.topGainers.length > 0) {
      prompt += `Top Performers:\n`;
      context.topGainers.forEach(g => {
        prompt += `- ${g.name} (${g.symbol}): +${g.pnl}% (₹${g.value})\n`;
      });
      prompt += `\n`;
    }
    
    if (context.topLosers.length > 0 && parseFloat(context.topLosers[0].pnl) < 0) {
      prompt += `Underperformers:\n`;
      context.topLosers.forEach(l => {
        if (parseFloat(l.pnl) < 0) {
          prompt += `- ${l.name} (${l.symbol}): ${l.pnl}% (₹${l.value})\n`;
        }
      });
      prompt += `\n`;
    }
    
    prompt += `Asset Allocation:\n`;
    Object.entries(context.assetAllocation).forEach(([type, percentage]) => {
      prompt += `- ${type}: ${percentage}%\n`;
    });
    
    return prompt;
  }
}

export default new PortfolioContextService();
