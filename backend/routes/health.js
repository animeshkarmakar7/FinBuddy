import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: getConnectionState(mongoose.connection.readyState),
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    },
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    }
  };

  const statusCode = health.database.connected ? 200 : 503;
  res.status(statusCode).json(health);
});

function getConnectionState(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
}

export default router;
