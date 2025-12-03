import categorizationService from '../services/ai/categorizationService.js';

// @desc    Categorize a transaction
// @route   POST /api/ai/categorize
// @access  Private
export const categorizeTransaction = async (req, res) => {
  try {
    const { merchant, amount, type } = req.body;

    if (!merchant) {
      return res.status(400).json({
        success: false,
        message: 'Merchant name is required',
      });
    }

    const result = await categorizationService.categorizeTransaction(
      merchant,
      amount,
      type,
      req.user.id
    );

    // Get alternative suggestions
    const alternatives = await categorizationService.getSuggestions(
      merchant,
      amount,
      type,
      req.user.id,
      2
    );

    res.status(200).json({
      success: true,
      data: {
        ...result,
        alternatives: alternatives.filter(alt => alt.category !== result.category),
      },
    });
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error categorizing transaction',
      error: error.message,
    });
  }
};

// @desc    Learn from user correction
// @route   POST /api/ai/learn
// @access  Private
export const learnFromCorrection = async (req, res) => {
  try {
    const { merchant, suggestedCategory, correctCategory } = req.body;

    if (!merchant || !correctCategory) {
      return res.status(400).json({
        success: false,
        message: 'Merchant and correct category are required',
      });
    }

    const result = await categorizationService.learnFromCorrection(
      req.user.id,
      merchant,
      suggestedCategory,
      correctCategory
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Learning error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving learning',
      error: error.message,
    });
  }
};

// @desc    Get category suggestions for a merchant
// @route   POST /api/ai/suggestions
// @access  Private
export const getSuggestions = async (req, res) => {
  try {
    const { merchant, amount, type } = req.body;

    if (!merchant) {
      return res.status(400).json({
        success: false,
        message: 'Merchant name is required',
      });
    }

    const suggestions = await categorizationService.getSuggestions(
      merchant,
      amount,
      type,
      req.user.id,
      5
    );

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions',
      error: error.message,
    });
  }
};

// @desc    Get user's learned merchant mappings
// @route   GET /api/ai/mappings
// @access  Private
export const getUserMappings = async (req, res) => {
  try {
    const mappings = await categorizationService.getUserMappings(req.user.id);

    res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings,
    });
  } catch (error) {
    console.error('Get mappings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mappings',
      error: error.message,
    });
  }
};

// @desc    Batch categorize transactions
// @route   POST /api/ai/batch-categorize
// @access  Private
export const batchCategorize = async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Transactions array is required',
      });
    }

    const results = await categorizationService.batchCategorize(
      transactions,
      req.user.id
    );

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Batch categorize error:', error);
    res.status(500).json({
      success: false,
      message: 'Error batch categorizing',
      error: error.message,
    });
  }
};
