import express from 'express';
import {
  getSpendingForecast,
  checkForecastHealth,
} from '../controllers/forecastController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/health', protect, checkForecastHealth);
router.get('/spending/:months', protect, getSpendingForecast);

export default router;
