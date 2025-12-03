import express from 'express';
import {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  optimizeGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createGoal);
router.get('/', protect, getGoals);
router.get('/:id', protect, getGoal);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);
router.post('/:id/contribute', protect, addContribution);
router.get('/:id/optimize', protect, optimizeGoal);

export default router;
