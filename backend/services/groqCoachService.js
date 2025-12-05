import Groq from 'groq-sdk';
import Transaction from '../models/Transaction.js';
import Goal from '../models/Goal.js';

class GroqCoachService {
  constructor() {
    // Validate API key when service is first used
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is not set in environment variables');
      throw new Error('GROQ_API_KEY is required. Please add it to your .env file.');
    }

    console.log('✅ Groq API Key loaded:', process.env.GROQ_API_KEY.substring(0, 10) + '...');
    
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // Use llama-3.1-8b-instant (updated model, replaces deprecated llama3-8b-8192)
    this.model = 'llama-3.1-8b-instant';
    
    console.log('✅ Groq initialized with model:', this.model);
  }

  /**
   * Get personalized financial insights
   */
  async getFinancialInsights(userId) {
    try {
      const financialData = await this.gatherFinancialData(userId);
      const prompt = this.createInsightPrompt(financialData);
      
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7,
        max_tokens: 500,
      });
      
      return {
        success: true,
        insights: completion.choices[0]?.message?.content || 'No insights generated',
        data: financialData,
      };
    } catch (error) {
      console.error('Groq insights error:', error);
      throw new Error('Failed to generate insights');
    }
  }

  /**
   * Analyze spending patterns and provide recommendations
   */
  async analyzeSpending(userId, category = null) {
    try {
      const financialData = await this.gatherFinancialData(userId);
      
      const prompt = `You are a friendly financial advisor for FinBuddy app. Analyze this user's spending:

**Monthly Summary:**
- Total Income: ₹${financialData.monthlyIncome.toLocaleString()}
- Total Expenses: ₹${financialData.monthlyExpenses.toLocaleString()}
- Savings: ₹${financialData.monthlySavings.toLocaleString()}
- Savings Rate: ${financialData.savingsRate}%

**Spending by Category:**
${Object.entries(financialData.categorySpending)
  .map(([cat, amount]) => `- ${cat}: ₹${amount.toLocaleString()}`)
  .join('\n')}

**Top Merchants:**
${financialData.topMerchants.map(m => `- ${m.merchant}: ₹${m.total.toLocaleString()} (${m.count} transactions)`).join('\n')}

${category ? `Focus on the "${category}" category.` : ''}

Provide:
1. A brief, friendly analysis (2-3 sentences)
2. Top 3 actionable recommendations to improve finances
3. One specific "quick win" they can do today

Keep it conversational, encouraging, and specific to their data. Use Indian Rupees (₹).`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7,
        max_tokens: 600,
      });
      
      return {
        success: true,
        analysis: completion.choices[0]?.message?.content || 'No analysis generated',
        data: financialData,
      };
    } catch (error) {
      console.error('Spending analysis error:', error);
      throw new Error('Failed to analyze spending');
    }
  }

  /**
   * Get goal-specific coaching
   */
  async getGoalCoaching(goalId, userId) {
    try {
      const Goal = (await import('../models/Goal.js')).default;
      const goal = await Goal.findById(goalId);
      
      if (!goal || goal.userId.toString() !== userId) {
        throw new Error('Goal not found');
      }

      const financialData = await this.gatherFinancialData(userId);
      
      const remaining = goal.targetAmount - goal.currentAmount;
      const deadline = new Date(goal.deadline);
      const monthsLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24 * 30));
      const requiredMonthlySavings = remaining / monthsLeft;

      const prompt = `You are a supportive financial coach helping a user achieve their goal.

**Goal Details:**
- Goal: ${goal.title}
- Target Amount: ₹${goal.targetAmount.toLocaleString()}
- Current Progress: ₹${goal.currentAmount.toLocaleString()} (${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%)
- Remaining: ₹${remaining.toLocaleString()}
- Deadline: ${deadline.toLocaleDateString()}
- Months Left: ${monthsLeft}
- Required Monthly Savings: ₹${requiredMonthlySavings.toLocaleString()}

**Current Financial Situation:**
- Monthly Income: ₹${financialData.monthlyIncome.toLocaleString()}
- Monthly Expenses: ₹${financialData.monthlyExpenses.toLocaleString()}
- Current Savings: ₹${financialData.monthlySavings.toLocaleString()}

**Top Spending Categories:**
${Object.entries(financialData.categorySpending)
  .slice(0, 5)
  .map(([cat, amount]) => `- ${cat}: ₹${amount.toLocaleString()}`)
  .join('\n')}

Provide:
1. Honest assessment: Are they on track? (be encouraging but realistic)
2. Specific recommendations to reach the goal (3-4 actionable items)
3. One category where they could cut spending to accelerate progress
4. A motivational message

Be friendly, specific, and use their actual numbers. Keep it concise (under 200 words).`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7,
        max_tokens: 700,
      });
      
      return {
        success: true,
        coaching: completion.choices[0]?.message?.content || 'No coaching generated',
        goal,
        metrics: {
          remaining,
          monthsLeft,
          requiredMonthlySavings,
          onTrack: financialData.monthlySavings >= requiredMonthlySavings,
        },
      };
    } catch (error) {
      console.error('Goal coaching error:', error);
      throw new Error('Failed to generate goal coaching');
    }
  }

  /**
   * Chat with AI coach - Enhanced with full user context
   */
  async chat(userId, message, conversationHistory = []) {
    try {
      const financialData = await this.gatherFinancialData(userId);
      
      // Build comprehensive system prompt with user's complete financial profile
      const systemPrompt = this.createChatSystemPrompt(financialData);
      
      const systemMessage = {
        role: 'system',
        content: systemPrompt
      };

      const messages = [
        systemMessage,
        ...conversationHistory.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : msg.role,
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      const completion = await this.groq.chat.completions.create({
        messages,
        model: this.model,
        temperature: 0.7,
        max_tokens: 500,
      });
      
      return {
        success: true,
        message: completion.choices[0]?.message?.content || 'No response generated',
        context: financialData,
      };
    } catch (error) {
      console.error('Chat error details:', {
        message: error.message,
        stack: error.stack,
      });
      
      if (error.message && error.message.includes('API key')) {
        throw new Error('Invalid Groq API key. Please check your .env file.');
      }
      
      throw new Error(error.message || 'Failed to process chat message');
    }
  }
  
  /**
   * Create comprehensive system prompt for chat
   */
  createChatSystemPrompt(data) {
    const userName = data.user.name || 'there';
    const memberSince = data.user.memberSince 
      ? new Date(data.user.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      : 'recently';
    
    // Format goals for prompt
    const goalsText = data.goals.active.length > 0
      ? data.goals.active.map(g => 
          `- ${g.title}: ₹${g.currentAmount.toLocaleString()}/₹${g.targetAmount.toLocaleString()} (${g.progress}% complete, ${g.status})`
        ).join('\n')
      : '- No active goals';
    
    // Format top categories
    const categoriesText = data.topCategories.length > 0
      ? data.topCategories.map(c => 
          `- ${c.category}: ₹${c.amount.toLocaleString()} (${c.percentage}%)`
        ).join('\n')
      : '- No spending data';
    
    // Format trends
    const trendsText = data.trends.growth
      ? `Income: ${data.trends.growth.income > 0 ? '+' : ''}${data.trends.growth.income}%, Expenses: ${data.trends.growth.expenses > 0 ? '+' : ''}${data.trends.growth.expenses}%, Savings: ${data.trends.growth.savings > 0 ? '+' : ''}${data.trends.growth.savings}%`
      : 'Not enough data';
    
    // Format insights
    const insightsText = data.insights.length > 0
      ? data.insights.map(i => `• ${i}`).join('\n')
      : '• Getting started with FinBuddy';
    
    return `You are a personal financial advisor for ${userName}, a FinBuddy user.

📊 COMPLETE USER PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Member Since: ${memberSince}

💰 ALL-TIME STATS:
- Total Income: ₹${data.allTime.totalIncome.toLocaleString()}
- Total Expenses: ₹${data.allTime.totalExpenses.toLocaleString()}
- Net Worth: ₹${data.allTime.netWorth.toLocaleString()}
- Total Transactions: ${data.allTime.transactionCount}

📈 CURRENT MONTH (Last 30 Days):
- Income: ₹${data.current.monthlyIncome.toLocaleString()}
- Expenses: ₹${data.current.monthlyExpenses.toLocaleString()}
- Savings: ₹${data.current.monthlySavings.toLocaleString()}
- Savings Rate: ${data.current.savingsRate}%

📊 TRENDS (vs Last Month):
${trendsText}

🎯 ACTIVE GOALS (${data.goals.activeCount}):
${goalsText}

💳 TOP SPENDING CATEGORIES:
${categoriesText}

💡 KEY INSIGHTS:
${insightsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCTIONS:
- Address ${userName} by name when appropriate
- Provide personalized, data-driven advice based on their ACTUAL numbers
- Reference their goals, trends, and spending patterns
- Be encouraging but realistic
- Keep responses concise (2-4 sentences)
- Use Indian Rupees (₹) format
- If they ask about specific categories or goals, use the data above
- Proactively suggest improvements based on their trends

Remember: You have complete knowledge of ${userName}'s financial situation. Use it to give specific, actionable advice!`;
  }

  /**
   * Gather comprehensive user financial data for AI context
   */
  async gatherFinancialData(userId) {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId).select('name email createdAt');
    
    // Time periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    
    // Get ALL transactions for all-time stats
    const allTransactions = await Transaction.find({ userId });
    
    // Get last 30 days transactions
    const recentTransactions = await Transaction.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    });
    
    // Get last 6 months transactions for trends
    const sixMonthTransactions = await Transaction.find({
      userId,
      date: { $gte: sixMonthsAgo },
    });
    
    // Get goals
    const activeGoals = await Goal.find({ userId, status: 'active' });
    const completedGoals = await Goal.find({ userId, status: 'completed' });
    
    // === ALL-TIME STATS ===
    const allTimeIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const allTimeExpenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netWorth = allTimeIncome - allTimeExpenses;
    
    // === LAST 30 DAYS ===
    const monthlyIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? ((monthlySavings / monthlyIncome) * 100).toFixed(1) : 0;
    
    // === MONTHLY TRENDS (Last 6 months) ===
    const monthlyTrends = this.calculateMonthlyTrends(sixMonthTransactions);
    
    // === CATEGORY BREAKDOWN ===
    const categorySpending = {};
    recentTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });
      
    // Sort categories by amount
    const topCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: monthlyExpenses > 0 ? ((amount / monthlyExpenses) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // === TOP MERCHANTS ===
    const merchantMap = {};
    recentTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!merchantMap[t.merchant]) {
          merchantMap[t.merchant] = { merchant: t.merchant, total: 0, count: 0 };
        }
        merchantMap[t.merchant].total += t.amount;
        merchantMap[t.merchant].count++;
      });
      
    const topMerchants = Object.values(merchantMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
    
    // === GOALS ANALYSIS ===
    const goalsData = activeGoals.map(goal => {
      const progress = goal.targetAmount > 0 
        ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
        : 0;
        
      const remaining = goal.targetAmount - goal.currentAmount;
      const deadline = new Date(goal.deadline);
      const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      const monthsLeft = Math.ceil(daysLeft / 30);
      const requiredMonthlySavings = monthsLeft > 0 ? remaining / monthsLeft : remaining;
      const onTrack = monthlySavings >= requiredMonthlySavings;
      
      return {
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        progress: parseFloat(progress),
        remaining,
        deadline: goal.deadline,
        daysLeft,
        monthsLeft,
        requiredMonthlySavings,
        onTrack,
        status: onTrack ? 'on-track' : 'behind'
      };
    });
    
    // === INSIGHTS ===
    const insights = this.generateInsights({
      monthlyTrends,
      savingsRate,
      goalsData,
      topCategories
    });
    
    return {
      // User Profile
      user: {
        name: user?.name || 'User',
        email: user?.email,
        memberSince: user?.createdAt,
      },
      
      // All-Time Stats
      allTime: {
        totalIncome: allTimeIncome,
        totalExpenses: allTimeExpenses,
        netWorth,
        transactionCount: allTransactions.length,
      },
      
      // Last 30 Days
      current: {
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        savingsRate: parseFloat(savingsRate),
        transactionCount: recentTransactions.length,
      },
      
      // Trends
      trends: monthlyTrends,
      
      // Categories
      categorySpending,
      topCategories,
      
      // Merchants
      topMerchants,
      
      // Goals
      goals: {
        active: goalsData,
        activeCount: activeGoals.length,
        completedCount: completedGoals.length,
      },
      
      // Insights
      insights,
      
      // Legacy fields for backward compatibility
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      savingsRate: parseFloat(savingsRate),
      activeGoals: activeGoals.length,
      transactionCount: recentTransactions.length,
    };
  }
  
  /**
   * Calculate monthly trends for last 6 months
   */
  calculateMonthlyTrends(transactions) {
    const monthlyData = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });
    
    // Calculate savings for each month
    const trends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses,
        savingsRate: data.income > 0 ? ((data.income - data.expenses) / data.income * 100).toFixed(1) : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    // Calculate growth rates
    if (trends.length >= 2) {
      const current = trends[trends.length - 1];
      const previous = trends[trends.length - 2];
      
      const incomeGrowth = previous.income > 0 
        ? (((current.income - previous.income) / previous.income) * 100).toFixed(1)
        : 0;
        
      const expenseGrowth = previous.expenses > 0
        ? (((current.expenses - previous.expenses) / previous.expenses) * 100).toFixed(1)
        : 0;
        
      const savingsGrowth = previous.savings > 0
        ? (((current.savings - previous.savings) / previous.savings) * 100).toFixed(1)
        : 0;
      
      return {
        monthly: trends,
        growth: {
          income: parseFloat(incomeGrowth),
          expenses: parseFloat(expenseGrowth),
          savings: parseFloat(savingsGrowth),
        }
      };
    }
    
    return {
      monthly: trends,
      growth: { income: 0, expenses: 0, savings: 0 }
    };
  }
  
  /**
   * Generate insights from financial data
   */
  generateInsights(data) {
    const insights = [];
    
    // Savings rate insight
    if (data.savingsRate >= 20) {
      insights.push(`Excellent savings rate of ${data.savingsRate}%!`);
    } else if (data.savingsRate >= 10) {
      insights.push(`Good savings rate of ${data.savingsRate}%, aim for 20%+`);
    } else {
      insights.push(`Low savings rate of ${data.savingsRate}%, try to save more`);
    }
    
    // Trend insight
    if (data.monthlyTrends.growth) {
      const { income, expenses, savings } = data.monthlyTrends.growth;
      
      if (expenses > 5) {
        insights.push(`Spending increased by ${expenses}% vs last month`);
      } else if (expenses < -5) {
        insights.push(`Great! Spending decreased by ${Math.abs(expenses)}%`);
      }
      
      if (savings > 10) {
        insights.push(`Savings improved by ${savings}% - keep it up!`);
      }
    }
    
    // Goals insight
    const behindGoals = data.goalsData.filter(g => !g.onTrack);
    if (behindGoals.length > 0) {
      insights.push(`${behindGoals.length} goal(s) need attention`);
    } else if (data.goalsData.length > 0) {
      insights.push(`All goals are on track!`);
    }
    
    // Top category insight
    if (data.topCategories.length > 0) {
      const top = data.topCategories[0];
      insights.push(`Top spending: ${top.category} (${top.percentage}%)`);
    }
    
    return insights;
  }

  /**
   * Create insight prompt
   */
  createInsightPrompt(data) {
    return `You are a financial advisor. Provide 3 key insights about this user's finances:

Income: ₹${data.monthlyIncome.toLocaleString()}
Expenses: ₹${data.monthlyExpenses.toLocaleString()}
Savings: ₹${data.monthlySavings.toLocaleString()} (${data.savingsRate}%)
Active Goals: ${data.activeGoals}

Top Spending:
${Object.entries(data.categorySpending)
  .slice(0, 3)
  .map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString()}`)
  .join('\n')}

Provide 3 bullet points: 1 positive observation, 1 area for improvement, 1 actionable tip. Be encouraging and specific.`;
  }
}

export default GroqCoachService;
