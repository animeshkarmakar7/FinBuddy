import express from 'express';
import {
  categorizeTransaction,
  learnFromCorrection,
  getSuggestions,
  getUserMappings,
  batchCategorize,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (require authentication)
router.post('/categorize', protect, categorizeTransaction);
router.post('/learn', protect, learnFromCorrection);
router.post('/suggestions', protect, getSuggestions);
router.get('/mappings', protect, getUserMappings);
router.post('/batch-categorize', protect, batchCategorize);

export default router;
