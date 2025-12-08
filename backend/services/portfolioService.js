import Investment from '../models/Investment.js';

class PortfolioService {
  /**
   * Get portfolio summary for a user
   */
  async getPortfolioSummary(userId) {
    const investments = await Investment.find({ userId, active: true });
    
    if (investments.length === 0) {
      return {
        totalInvested: 0,
        currentValue: 0,
        totalReturns: 0,
        returnsPercentage: 0,
        todaysPL: 0,
        assetAllocation: [],
        topGainers: [],
        topLosers: [],
        holdings: []
      };
    }
    
    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturns = currentValue - totalInvested;
    const returnsPercentage = totalInvested > 0 
      ? ((totalReturns / totalInvested) * 100).toFixed(2)
      : 0;
    
    // Asset allocation
    const assetAllocation = this.calculateAssetAllocation(investments, currentValue);
    
    // Top gainers and losers
    const sorted = [...investments].sort((a, b) => b.returnsPercentage - a.returnsPercentage);
    const topGainers = sorted.slice(0, 5).filter(inv => inv.returns > 0);
    const topLosers = sorted.slice(-5).filter(inv => inv.returns < 0).reverse();
    
    return {
      totalInvested,
      currentValue,
      totalReturns,
      returnsPercentage: parseFloat(returnsPercentage),
      todaysPL: 0, // Will be calculated with daily price changes
      assetAllocation,
      topGainers: topGainers.map(inv => ({
        name: inv.name,
        symbol: inv.symbol,
        returns: inv.returns,
        returnsPercentage: inv.returnsPercentage,
        currentValue: inv.currentValue
      })),
      topLosers: topLosers.map(inv => ({
        name: inv.name,
        symbol: inv.symbol,
        returns: inv.returns,
        returnsPercentage: inv.returnsPercentage,
        currentValue: inv.currentValue
      })),
      holdings: investments.map(inv => ({
        id: inv._id,
        type: inv.type,
        name: inv.name,
        symbol: inv.symbol,
        quantity: inv.quantity,
        avgBuyPrice: inv.avgBuyPrice,
        currentPrice: inv.currentPrice,
        totalInvested: inv.totalInvested,
        currentValue: inv.currentValue,
        returns: inv.returns,
        returnsPercentage: inv.returnsPercentage,
        lastUpdated: inv.lastUpdated
      }))
    };
  }
  
  /**
   * Calculate asset allocation
   */
  calculateAssetAllocation(investments, totalValue) {
    const allocation = {};
    
    investments.forEach(inv => {
      if (!allocation[inv.type]) {
        allocation[inv.type] = 0;
      }
      allocation[inv.type] += inv.currentValue;
    });
    
    return Object.entries(allocation).map(([type, value]) => ({
      type,
      value,
      percentage: totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : 0
    }));
  }
  
  /**
   * Get sector allocation
   */
  async getSectorAllocation(userId) {
    const investments = await Investment.find({ 
      userId, 
      active: true,
      type: 'stock'
    });
    
    const sectorMap = {};
    let totalValue = 0;
    
    investments.forEach(inv => {
      const sector = inv.sector || 'Other';
      if (!sectorMap[sector]) {
        sectorMap[sector] = 0;
      }
      sectorMap[sector] += inv.currentValue;
      totalValue += inv.currentValue;
    });
    
    return Object.entries(sectorMap).map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : 0
    }));
  }
  
  /**
   * Get portfolio performance history
   */
  async getPerformanceHistory(userId, days = 30) {
    // This would require storing daily snapshots
    // For now, return placeholder
    return {
      dates: [],
      values: [],
      invested: []
    };
  }
  
  /**
   * Calculate portfolio metrics
   */
  async getPortfolioMetrics(userId) {
    const investments = await Investment.find({ userId, active: true });
    
    if (investments.length === 0) {
      return null;
    }
    
    const returns = investments.map(inv => inv.returnsPercentage);
    
    return {
      totalHoldings: investments.length,
      avgReturns: (returns.reduce((a, b) => a + b, 0) / returns.length).toFixed(2),
      bestPerformer: Math.max(...returns).toFixed(2),
      worstPerformer: Math.min(...returns).toFixed(2),
      diversification: this.calculateDiversification(investments)
    };
  }
  
  /**
   * Calculate diversification score
   */
  calculateDiversification(investments) {
    const types = new Set(investments.map(inv => inv.type));
    const sectors = new Set(investments.map(inv => inv.sector).filter(Boolean));
    
    // Simple diversification score (0-100)
    const typeScore = Math.min(types.size * 20, 40);
    const sectorScore = Math.min(sectors.size * 10, 40);
    const countScore = Math.min(investments.length * 2, 20);
    
    return typeScore + sectorScore + countScore;
  }
}

export default new PortfolioService();
