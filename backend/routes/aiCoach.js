import express from 'express';
import {
  getInsights,
  analyzeSpending,
  getGoalCoaching,
  chat,
  executeCreateGoal,
  executeAddTransaction,
  executeUpdateGoal,
} from '../controllers/aiCoachController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/insights', protect, getInsights);
router.get('/analyze/:category?', protect, analyzeSpending);
router.get('/goal/:goalId', protect, getGoalCoaching);
router.post('/chat', protect, chat);

// Action execution routes
router.post('/action/create-goal', protect, executeCreateGoal);
router.post('/action/add-transaction', protect, executeAddTransaction);
router.post('/action/update-goal', protect, executeUpdateGoal);

export default router;
