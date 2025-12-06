import express from 'express';
import comparisonService from '../services/comparisonService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get month-over-month comparison
// @route   GET /api/analytics/comparison/month-over-month
// @access  Private
router.get('/comparison/month-over-month', protect, async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const comparison = await comparisonService.getMonthOverMonth(
      req.user.id,
      currentYear,
      currentMonth
    );

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get year-over-year comparison
// @route   GET /api/analytics/comparison/year-over-year
// @access  Private
router.get('/comparison/year-over-year', protect, async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const comparison = await comparisonService.getYearOverYear(
      req.user.id,
      currentYear,
      currentMonth
    );

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get custom period comparison
// @route   POST /api/analytics/comparison/custom
// @access  Private
router.post('/comparison/custom', protect, async (req, res) => {
  try {
    const { currentStart, currentEnd, previousStart, previousEnd } = req.body;

    const comparison = await comparisonService.comparePeriods(
      req.user.id,
      currentStart,
      currentEnd,
      previousStart,
      previousEnd
    );

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
