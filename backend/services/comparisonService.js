import Transaction from '../models/Transaction.js';

class ComparisonService {
  /**
   * Compare two time periods
   */
  async comparePeriods(userId, currentStart, currentEnd, previousStart, previousEnd) {
    // Get transactions for both periods
    const [currentPeriod, previousPeriod] = await Promise.all([
      this.getPeriodData(userId, currentStart, currentEnd),
      this.getPeriodData(userId, previousStart, previousEnd)
    ]);

    // Calculate comparisons
    const comparison = {
      current: currentPeriod,
      previous: previousPeriod,
      changes: this.calculateChanges(currentPeriod, previousPeriod),
      insights: this.generateInsights(currentPeriod, previousPeriod)
    };

    return comparison;
  }

  /**
   * Get aggregated data for a period
   */
  async getPeriodData(userId, startDate, endDate) {
    const transactions = await Transaction.find({
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    // Merchant breakdown
    const merchantBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        merchantBreakdown[t.merchant] = (merchantBreakdown[t.merchant] || 0) + t.amount;
      });

    return {
      income,
      expenses,
      savings: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0,
      transactionCount: transactions.length,
      categoryBreakdown,
      merchantBreakdown,
      avgTransactionAmount: transactions.length > 0 ? expenses / transactions.filter(t => t.type === 'expense').length : 0
    };
  }

  /**
   * Calculate changes between periods
   */
  calculateChanges(current, previous) {
    const changes = {
      income: this.calculateChange(current.income, previous.income),
      expenses: this.calculateChange(current.expenses, previous.expenses),
      savings: this.calculateChange(current.savings, previous.savings),
      savingsRate: {
        current: parseFloat(current.savingsRate),
        previous: parseFloat(previous.savingsRate),
        absolute: parseFloat(current.savingsRate) - parseFloat(previous.savingsRate),
        percentage: previous.savingsRate > 0 
          ? ((parseFloat(current.savingsRate) - parseFloat(previous.savingsRate)) / parseFloat(previous.savingsRate) * 100).toFixed(1)
          : 0
      },
      transactionCount: this.calculateChange(current.transactionCount, previous.transactionCount),
      categories: this.compareCategoryBreakdown(current.categoryBreakdown, previous.categoryBreakdown)
    };

    return changes;
  }

  /**
   * Calculate change for a metric
   */
  calculateChange(current, previous) {
    const absolute = current - previous;
    const percentage = previous > 0 ? ((absolute / previous) * 100).toFixed(1) : 0;
    
    return {
      current,
      previous,
      absolute,
      percentage: parseFloat(percentage),
      trend: absolute > 0 ? 'up' : absolute < 0 ? 'down' : 'stable'
    };
  }

  /**
   * Compare category breakdowns
   */
  compareCategoryBreakdown(current, previous) {
    const allCategories = new Set([
      ...Object.keys(current),
      ...Object.keys(previous)
    ]);

    const comparison = [];

    for (const category of allCategories) {
      const currentAmount = current[category] || 0;
      const previousAmount = previous[category] || 0;
      const change = this.calculateChange(currentAmount, previousAmount);

      comparison.push({
        category,
        ...change
      });
    }

    // Sort by absolute change (biggest changes first)
    return comparison.sort((a, b) => Math.abs(b.absolute) - Math.abs(a.absolute));
  }

  /**
   * Generate insights from comparison
   */
  generateInsights(current, previous) {
    const insights = [];

    // Income insights
    const incomeChange = ((current.income - previous.income) / previous.income * 100).toFixed(1);
    if (Math.abs(incomeChange) > 5) {
      insights.push({
        type: incomeChange > 0 ? 'positive' : 'warning',
        category: 'Income',
        message: `Income ${incomeChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(incomeChange)}%`
      });
    }

    // Expense insights
    const expenseChange = ((current.expenses - previous.expenses) / previous.expenses * 100).toFixed(1);
    if (Math.abs(expenseChange) > 10) {
      insights.push({
        type: expenseChange > 0 ? 'warning' : 'positive',
        category: 'Expenses',
        message: `Spending ${expenseChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(expenseChange)}%`
      });
    }

    // Savings insights
    const savingsChange = ((current.savings - previous.savings) / previous.savings * 100).toFixed(1);
    if (Math.abs(savingsChange) > 15) {
      insights.push({
        type: savingsChange > 0 ? 'positive' : 'warning',
        category: 'Savings',
        message: `Savings ${savingsChange > 0 ? 'improved' : 'declined'} by ${Math.abs(savingsChange)}%`
      });
    }

    // Category-specific insights
    for (const [category, currentAmount] of Object.entries(current.categoryBreakdown)) {
      const previousAmount = previous.categoryBreakdown[category] || 0;
      if (previousAmount > 0) {
        const change = ((currentAmount - previousAmount) / previousAmount * 100).toFixed(1);
        if (Math.abs(change) > 25) {
          insights.push({
            type: change > 0 ? 'warning' : 'info',
            category,
            message: `${category} spending ${change > 0 ? 'up' : 'down'} ${Math.abs(change)}%`
          });
        }
      }
    }

    return insights;
  }

  /**
   * Get month-over-month comparison
   */
  async getMonthOverMonth(userId, year, month) {
    const currentStart = new Date(year, month - 1, 1);
    const currentEnd = new Date(year, month, 0);
    
    const previousStart = new Date(year, month - 2, 1);
    const previousEnd = new Date(year, month - 1, 0);

    return this.comparePeriods(userId, currentStart, currentEnd, previousStart, previousEnd);
  }

  /**
   * Get year-over-year comparison
   */
  async getYearOverYear(userId, year, month) {
    const currentStart = new Date(year, month - 1, 1);
    const currentEnd = new Date(year, month, 0);
    
    const previousStart = new Date(year - 1, month - 1, 1);
    const previousEnd = new Date(year - 1, month, 0);

    return this.comparePeriods(userId, currentStart, currentEnd, previousStart, previousEnd);
  }
}

export default new ComparisonService();
