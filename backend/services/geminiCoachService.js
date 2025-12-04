import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/Transaction.js';
import Goal from '../models/Goal.js';

class GeminiCoachService {
  constructor() {
    // Validate API key when service is first used
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not set in environment variables');
      throw new Error('GEMINI_API_KEY is required. Please add it to your .env file.');
    }

    console.log('✅ Gemini API Key loaded:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try with just model name, no prefix
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('✅ Gemini model initialized: gemini-pro');
  }

  /**
   * Get personalized financial insights
   */
  async getFinancialInsights(userId) {
    try {
      // Gather user's financial data
      const financialData = await this.gatherFinancialData(userId);
      
      // Create context-aware prompt
      const prompt = this.createInsightPrompt(financialData);
      
      // Get AI insights
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const insights = response.text();
      
      return {
        success: true,
        insights,
        data: financialData,
      };
    } catch (error) {
      console.error('Gemini insights error:', error);
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

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        analysis: response.text(),
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

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        success: true,
        coaching: response.text(),
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
   * Chat with AI coach
   */
  async chat(userId, message, conversationHistory = []) {
    try {
      const financialData = await this.gatherFinancialData(userId);
      
      // Create context for the chat
      const systemContext = `You are a friendly, knowledgeable financial advisor for FinBuddy. 
      
User's Financial Summary:
- Monthly Income: ₹${financialData.monthlyIncome.toLocaleString()}
- Monthly Expenses: ₹${financialData.monthlyExpenses.toLocaleString()}
- Savings Rate: ${financialData.savingsRate}%
- Active Goals: ${financialData.activeGoals}

Keep responses concise (2-3 sentences), encouraging, and actionable. Use Indian Rupees (₹).`;

      // Build conversation
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemContext }],
          },
          {
            role: 'model',
            parts: [{ text: 'I understand. I\'m ready to help with financial advice!' }],
          },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })),
        ],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      
      return {
        success: true,
        message: response.text(),
        context: financialData,
      };
    } catch (error) {
      console.error('Chat error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      
      // Return more specific error message
      if (error.message && error.message.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your .env file.');
      }
      
      throw new Error(error.message || 'Failed to process chat message');
    }
  }

  /**
   * Gather user's financial data for context
   */
  async gatherFinancialData(userId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    });

    const goals = await Goal.find({ userId, status: 'active' });

    // Calculate metrics
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    // Category breakdown
    const categorySpending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    // Top merchants
    const merchantMap = {};
    transactions
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

    return {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      monthlySavings: savings,
      savingsRate,
      categorySpending,
      topMerchants,
      activeGoals: goals.length,
      transactionCount: transactions.length,
    };
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

// Export the class, not an instance (so it's created after dotenv loads)
export default GeminiCoachService;
