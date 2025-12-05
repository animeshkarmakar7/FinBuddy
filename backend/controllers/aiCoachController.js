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

// @desc    Chat with AI coach
// @route   POST /api/ai-coach/chat
// @access  Private
export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const response = await getService().chat(
      req.user.id,
      message,
      history || []
    );
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
