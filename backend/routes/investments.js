import express from 'express';
import {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  addTransaction,
  getPortfolioSummary,
  getSectorAllocation,
  getPortfolioMetrics,
  forcePriceUpdate
} from '../controllers/investmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Portfolio routes (must be before /:id routes)
router.get('/portfolio/summary', protect, getPortfolioSummary);
router.get('/portfolio/sectors', protect, getSectorAllocation);
router.get('/portfolio/metrics', protect, getPortfolioMetrics);

// Investment CRUD
router.route('/')
  .get(protect, getInvestments)
  .post(protect, createInvestment);

router.route('/:id')
  .get(protect, getInvestment)
  .put(protect, updateInvestment)
  .delete(protect, deleteInvestment);

// Transactions
router.post('/:id/transaction', protect, addTransaction);

// Price updates
router.post('/price-update', protect, forcePriceUpdate);

export default router;
