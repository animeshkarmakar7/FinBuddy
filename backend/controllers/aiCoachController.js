import GroqCoachService from '../services/groqCoachService.js';

// Lazy initialization - create instance only when needed (after dotenv loads)
let groqCoachService = null;

const getService = () => {
  if (!groqCoachService) {
    groqCoachService = new GroqCoachService();
  }
  return groqCoachService;
};

// @desc    Get AI financial insights
// @route   GET /api/ai-coach/insights
// @access  Private
export const getInsights = async (req, res) => {
  try {
    const insights = await getService().getFinancialInsights(req.user.id);
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Analyze spending patterns
// @route   GET /api/ai-coach/analyze/:category?
// @access  Private
export const analyzeSpending = async (req, res) => {
  try {
    const category = req.params.category || null;
    const analysis = await getService().analyzeSpending(req.user.id, category);
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get goal-specific coaching
// @route   GET /api/ai-coach/goal/:goalId
// @access  Private
export const getGoalCoaching = async (req, res) => {
  try {
    const coaching = await getService().getGoalCoaching(
      req.params.goalId,
      req.user.id
    );
    res.status(200).json(coaching);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Chat with AI coach (enhanced with context and history)
// @route   POST /api/ai-coach/chat
// @access  Private
export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Import services
    const ChatHistory = (await import('../models/ChatHistory.js')).default;
    const portfolioContextService = (await import('../services/portfolioContextService.js')).default;
    const marketContextService = (await import('../services/marketContextService.js')).default;
    
    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${req.user.id}`;
    
    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ 
      userId: req.user.id,
      sessionId: currentSessionId 
    });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.user.id,
        sessionId: currentSessionId,
        messages: []
      });
    }
    
    // Get portfolio context
    const portfolioContext = await portfolioContextService.getPortfolioContext(req.user.id);
    
    // Get market context
    const marketContext = await marketContextService.getMarketContext();
    
    // Build conversation history for AI
    const conversationHistory = chatHistory.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Call AI with conversation history only (Groq service doesn't use context params)
    const response = await getService().chat(
      req.user.id,
      message,
      conversationHistory
    );
    
    // Extract response content - Groq service returns 'message' property
    const aiResponse = response.message || response.response || 'No response generated';
    
    // Save user message
    chatHistory.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
      contextSnapshot: {
        portfolioValue: portfolioContext.totalValue || 0,
        pnl: portfolioContext.pnlPercentage || 0
      }
    });
    
    // Save assistant response
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });
    
    await chatHistory.save();
    
    res.status(200).json({
      success: true,
      response: aiResponse,
      sessionId: currentSessionId,
      context: {
        hasPortfolio: portfolioContext.hasPortfolio || false,
        portfolioValue: portfolioContext.totalValue || 0,
        pnl: portfolioContext.pnlPercentage || 0
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get chat history
// @route   GET /api/ai-coach/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const ChatHistory = (await import('../models/ChatHistory.js')).default;
    
    const sessions = await ChatHistory.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('sessionId messages createdAt updatedAt');
    
    // Format sessions with titles
    const formattedSessions = sessions.map(session => ({
      sessionId: session.sessionId,
      title: session.messages[0]?.content.substring(0, 50) + '...' || 'New Chat',
      messageCount: session.messages.length,
      lastMessage: session.messages[session.messages.length - 1]?.content.substring(0, 100),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));
    
    res.status(200).json({
      success: true,
      sessions: formattedSessions
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get specific chat session
// @route   GET /api/ai-coach/history/:sessionId
// @access  Private
export const getChatSession = async (req, res) => {
  try {
    const ChatHistory = (await import('../models/ChatHistory.js')).default;
    
    const session = await ChatHistory.findOne({
      userId: req.user.id,
      sessionId: req.params.sessionId
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      session: {
        sessionId: session.sessionId,
        messages: session.messages,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete chat session
// @route   DELETE /api/ai-coach/history/:sessionId
// @access  Private
export const deleteChatSession = async (req, res) => {
  try {
    const ChatHistory = (await import('../models/ChatHistory.js')).default;
    
    await ChatHistory.deleteOne({
      userId: req.user.id,
      sessionId: req.params.sessionId
    });
    
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Execute AI-suggested action (create goal)
// @route   POST /api/ai-coach/action/create-goal
// @access  Private
export const executeCreateGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, category } = req.body;
    
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, target amount, and deadline are required',
      });
    }

    const Goal = (await import('../models/Goal.js')).default;
    
    const goal = await Goal.create({
      userId: req.user.id,
      title,
      targetAmount,
      currentAmount: 0,
      deadline: new Date(deadline),
      category: category || 'other',
      status: 'active'
    });
    
    res.status(201).json({
      success: true,
      message: `Goal "${title}" created successfully!`,
      goal: {
        id: goal._id,
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
        milestones: goal.milestones
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Execute AI-suggested action (add transaction)
// @route   POST /api/ai-coach/action/add-transaction
// @access  Private
export const executeAddTransaction = async (req, res) => {
  try {
    const { type, amount, category, merchant, description } = req.body;
    
    if (!type || !amount || !category || !merchant) {
      return res.status(400).json({
        success: false,
        message: 'Type, amount, category, and merchant are required',
      });
    }

    const Transaction = (await import('../models/Transaction.js')).default;
    
    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      category,
      merchant,
      description: description || '',
      date: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: `${type === 'income' ? 'Income' : 'Expense'} of ₹${amount} added successfully!`,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        merchant: transaction.merchant
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Execute AI-suggested action (update goal progress)
// @route   POST /api/ai-coach/action/update-goal
// @access  Private
export const executeUpdateGoal = async (req, res) => {
  try {
    const { goalTitle, amount, note } = req.body;
    
    if (!goalTitle || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Goal title and amount are required',
      });
    }

    const Goal = (await import('../models/Goal.js')).default;
    
    // Find goal by title (case-insensitive)
    const goal = await Goal.findOne({ 
      userId: req.user.id, 
      title: { $regex: new RegExp(goalTitle, 'i') },
      status: 'active'
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: `Goal "${goalTitle}" not found`,
      });
    }
    
    // Add contribution
    await goal.addContribution(amount, note || 'AI-assisted contribution', 'ai_suggested');
    
    // Check for newly achieved milestones
    const newlyAchieved = goal.milestones.filter(m => 
      m.achieved && 
      m.achievedDate && 
      new Date(m.achievedDate).getTime() > Date.now() - 5000
    );
    
    res.status(200).json({
      success: true,
      message: `Added ₹${amount} to ${goal.title}!`,
      goal: {
        id: goal._id,
        title: goal.title,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
        progress: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1),
        remaining: goal.targetAmount - goal.currentAmount
      },
      milestonesAchieved: newlyAchieved.map(m => ({
        percentage: m.percentage,
        reward: m.reward
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
