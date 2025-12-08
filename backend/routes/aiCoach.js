import express from 'express';
import {
  getInsights,
  analyzeSpending,
  getGoalCoaching,
  chat,
  getChatHistory,
  getChatSession,
  deleteChatSession,
  executeCreateGoal,
  executeAddTransaction,
  executeUpdateGoal,
} from '../controllers/aiCoachController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// AI Coach routes
router.get('/insights', getInsights);
router.get('/analyze/:category?', analyzeSpending);
router.get('/goal/:goalId', getGoalCoaching);
router.post('/chat', chat);

// Chat history routes
router.get('/history', getChatHistory);
router.get('/history/:sessionId', getChatSession);
router.delete('/history/:sessionId', deleteChatSession);

// Action execution routes
router.post('/action/create-goal', executeCreateGoal);
router.post('/action/add-transaction', executeAddTransaction);
router.post('/action/update-goal', executeUpdateGoal);

export default router;
