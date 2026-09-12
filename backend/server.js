/**
 * Very Bright Calculator - Backend Server
 * Futuristic Mathematical Investigation Engine
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import analysisRoutes from './routes/analysisRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calculus_of_absurdity';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.includes('/stream')) {
      console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'Very Bright Calculator Research Core',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Mount routes
app.use('/api', analysisRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Very Bright Calculator API',
    version: '1.0.0',
    tagline: 'Every simple question deserves an unnecessarily complicated answer.',
    endpoints: {
      analyze: 'POST /api/analyze',
      analyzeStream: 'GET or POST /api/analyze/stream',
      archive: 'GET /api/analyses',
      health: 'GET /api/health'
    }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Anomaly]:', err);
  res.status(500).json({
    error: 'An internal analytical disturbance occurred.'
  });
});

// MongoDB Connection with seamless fallback
async function initializeDatabase() {
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('[Database] MongoDB connection established successfully.');
  } catch (err) {
    console.warn('[Database] MongoDB service offline or unreachable. Active fallback: Resilient In-Memory Session Store.');
  }
}

// Start Server with resilient port fallback (e.g. when macOS ControlCenter occupies 5000)
function startServer(portToTry) {
  const srv = app.listen(portToTry, async () => {
    console.log(`\n========================================================`);
    console.log(`  VERY BRIGHT CALCULATOR - MATHEMATICAL RESEARCH CORE`);
    console.log(`  "Every simple question deserves an unnecessarily complicated answer."`);
    console.log(`  Server listening on: http://localhost:${portToTry}`);
    console.log(`========================================================\n`);
    await initializeDatabase();
  });

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToTry === 5000) {
      console.warn(`[Server] Port 5000 is occupied (commonly macOS AirPlay Receiver). Switching to port 5050.`);
      startServer(5050);
    } else {
      console.error('[Server Error]:', err);
    }
  });

  return srv;
}

const server = startServer(Number(PORT));

export default app;
