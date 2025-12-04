import express from 'express';
import {
  getInsights,
  analyzeSpending,
  getGoalCoaching,
  chat,
} from '../controllers/aiCoachController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/insights', protect, getInsights);
router.get('/analyze/:category?', protect, analyzeSpending);
router.get('/goal/:goalId', protect, getGoalCoaching);
router.post('/chat', protect, chat);

export default router;
