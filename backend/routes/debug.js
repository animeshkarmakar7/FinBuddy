import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Debug endpoint to check environment variables
router.get('/debug-env', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    keyPreview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) + '...' : 'NOT FOUND',
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
  });
});

export default router;
