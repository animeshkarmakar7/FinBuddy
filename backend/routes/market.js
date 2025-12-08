import express from 'express';
import {
  getTrendingStocks,
  getTopGainers,
  getTopLosers,
  getTopCryptos,
  searchInvestments,
  getInvestmentDetails,
  getStockQuote
} from '../controllers/marketController.js';

const router = express.Router();

// Trending & Top performers
router.get('/trending/stocks', getTrendingStocks);
router.get('/stocks/gainers', getTopGainers);
router.get('/stocks/losers', getTopLosers);
router.get('/crypto/top', getTopCryptos);

// Search
router.get('/search', searchInvestments);

// Details
router.get('/details/:symbol', getInvestmentDetails);
router.get('/quote/:symbol', getStockQuote);

export default router;
