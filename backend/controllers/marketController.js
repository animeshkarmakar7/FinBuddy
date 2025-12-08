import marketDataService from '../services/marketDataService.js';

// @desc    Get trending stocks
// @route   GET /api/market/trending/stocks
// @access  Public
export const getTrendingStocks = async (req, res) => {
  try {
    const stocks = await marketDataService.getTrendingStocks();
    
    res.json({
      success: true,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get top gaining stocks
// @route   GET /api/market/stocks/gainers
// @access  Public
export const getTopGainers = async (req, res) => {
  try {
    const gainers = await marketDataService.getTopGainers();
    
    res.json({
      success: true,
      count: gainers.length,
      data: gainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get top losing stocks
// @route   GET /api/market/stocks/losers
// @access  Public
export const getTopLosers = async (req, res) => {
  try {
    const losers = await marketDataService.getTopLosers();
    
    res.json({
      success: true,
      count: losers.length,
      data: losers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get top cryptocurrencies
// @route   GET /api/market/crypto/top
// @access  Public
export const getTopCryptos = async (req, res) => {
  try {
    const cryptos = await marketDataService.getTopCryptos();
    
    res.json({
      success: true,
      count: cryptos.length,
      data: cryptos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search investments
// @route   GET /api/market/search
// @access  Public
export const searchInvestments = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    const results = await marketDataService.searchInvestments(q);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get investment details
// @route   GET /api/market/details/:symbol
// @access  Public
export const getInvestmentDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { type } = req.query; // stock or crypto
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Type parameter is required (stock or crypto)'
      });
    }
    
    const details = await marketDataService.getInvestmentDetails(symbol, type);
    
    if (!details) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get stock quote
// @route   GET /api/market/quote/:symbol
// @access  Public
export const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await marketDataService.getStockQuote(symbol);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
