import Investment from '../models/Investment.js';
import portfolioService from '../services/portfolioService.js';
import priceUpdateService from '../services/priceUpdateService.js';

// @desc    Get all investments for user
// @route   GET /api/investments
// @access  Private
export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ 
      userId: req.user.id,
      active: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: investments.length,
      data: investments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single investment
// @route   GET /api/investments/:id
// @access  Private
export const getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new investment
// @route   POST /api/investments
// @access  Private
export const createInvestment = async (req, res) => {
  try {
    const { type, symbol, name, exchange, quantity, price, date, charges, sector, industry } = req.body;
    
    // Create investment
    const investment = await Investment.create({
      userId: req.user.id,
      type,
      symbol: symbol.toUpperCase(),
      name,
      exchange: exchange || 'NSE',
      quantity,
      avgBuyPrice: price,
      currentPrice: price,
      sector,
      industry,
      transactions: [{
        type: 'buy',
        quantity,
        price,
        date: date || new Date(),
        charges: charges || 0
      }]
    });
    
    // Fetch current price
    try {
      await priceUpdateService.forceUpdate(investment.symbol, investment.type);
    } catch (error) {
      console.log('Could not fetch initial price:', error.message);
    }
    
    res.status(201).json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Private
export const updateInvestment = async (req, res) => {
  try {
    let investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    const { name, sector, industry } = req.body;
    
    if (name) investment.name = name;
    if (sector) investment.sector = sector;
    if (industry) investment.industry = industry;
    
    await investment.save();
    
    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete investment
// @route   DELETE /api/investments/:id
// @access  Private
export const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    investment.active = false;
    await investment.save();
    
    res.json({
      success: true,
      message: 'Investment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add transaction to investment
// @route   POST /api/investments/:id/transaction
// @access  Private
export const addTransaction = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    const { type, quantity, price, date, charges, notes } = req.body;
    
    await investment.addTransaction({
      type,
      quantity,
      price,
      date: date || new Date(),
      charges: charges || 0,
      notes
    });
    
    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get portfolio summary
// @route   GET /api/investments/portfolio/summary
// @access  Private
export const getPortfolioSummary = async (req, res) => {
  try {
    const summary = await portfolioService.getPortfolioSummary(req.user.id);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get sector allocation
// @route   GET /api/investments/portfolio/sectors
// @access  Private
export const getSectorAllocation = async (req, res) => {
  try {
    const sectors = await portfolioService.getSectorAllocation(req.user.id);
    
    res.json({
      success: true,
      data: sectors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get portfolio metrics
// @route   GET /api/investments/portfolio/metrics
// @access  Private
export const getPortfolioMetrics = async (req, res) => {
  try {
    const metrics = await portfolioService.getPortfolioMetrics(req.user.id);
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Force price update for symbol
// @route   POST /api/investments/price-update
// @access  Private
export const forcePriceUpdate = async (req, res) => {
  try {
    const { symbol, type } = req.body;
    
    const price = await priceUpdateService.forceUpdate(symbol, type);
    
    res.json({
      success: true,
      data: { symbol, price }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
