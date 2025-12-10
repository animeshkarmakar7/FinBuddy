import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import paymentMethodRoutes from './routes/paymentMethods.js';
import aiRoutes from './routes/ai.js';
import goalRoutes from './routes/goals.js';
import forecastRoutes from './routes/forecast.js';
import aiCoachRoutes from './routes/aiCoach.js';
import debugRoutes from './routes/debug.js';
import healthRoutes from './routes/health.js';
import analyticsRoutes from './routes/analytics.js';
import investmentRoutes from './routes/investments.js';
import marketRoutes from './routes/market.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet()); // Set security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration - Allow frontend to access backend
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin && (origin.includes('.railway.app') || origin.includes('.onrender.com'))) {
      // Allow production domains from Railway or Render
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/ai-coach', aiCoachRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/debug', debugRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinBuddy API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FinBuddy API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      transactions: '/api/transactions',
      paymentMethods: '/api/payment-methods',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      if (origin && (origin.includes('.railway.app') || origin.includes('.onrender.com'))) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Import services
import priceUpdateService from './services/priceUpdateService.js';

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  // Subscribe to price updates
  socket.on('subscribe', (symbols) => {
    console.log(`📊 Client subscribed to: ${symbols.join(', ')}`);
    symbols.forEach(symbol => {
      socket.join(symbol);
    });
  });
  
  // Unsubscribe from price updates
  socket.on('unsubscribe', (symbols) => {
    symbols.forEach(symbol => {
      socket.leave(symbol);
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Price update events
priceUpdateService.on('priceUpdate', ({ symbol, price, type }) => {
  io.to(symbol).emit('priceUpdate', { symbol, price, type });
});

// Start services
priceUpdateService.start();

// Start server
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`⚡ WebSocket enabled for real-time updates\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Process terminated');
  });
});

export default app;
