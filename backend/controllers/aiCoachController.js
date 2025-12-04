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
