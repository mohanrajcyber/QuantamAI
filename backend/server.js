import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Import route handlers
import aiRoutes from './routes/ai.js';
import ollamaRoutes from './routes/ollama.js';
import healthRoutes from './routes/health.js';
import mockAiRoutes from './routes/mock-ai.js';
import chatRoutes from './routes/chat.js'; // New unified chat routes
import ttsRoutes from './routes/tts.js'; // TTS routes for Avatar
import jobsRoutes from './routes/jobs.js'; // Job search routes
import youtubeRoutes from './routes/youtube.js'; // YouTube API routes (with NEW unrestricted key!)
import adminRoutes from './routes/admin.js'; // Creator admin control system
import analyticsRoutes from './routes/analytics.js'; // Real-time analytics and user tracking
import authRoutes from './routes/auth.js'; // Authentication and user management

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for WebSocket support
const server = createServer(app);

// Security middleware
app.use(helmet());

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:8000', // TalkingHead Avatar
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limiting for analytics endpoints
    return req.path.startsWith('/api/analytics');
  }
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lockdown middleware - blocks all non-admin requests when activated
app.use((req, res, next) => {
  if (global.QUANTUM_LOCKDOWN && !req.path.startsWith('/api/admin')) {
    return res.status(503).json({
      error: 'System Lockdown',
      message: 'Quantum AI is currently in lockdown mode. Only creator access is permitted.'
    });
  }
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ollama', ollamaRoutes);
app.use('/api/mock-ai', mockAiRoutes);
app.use('/api/chat', chatRoutes); // New unified chat API
app.use('/api/tts', ttsRoutes); // TTS API for Avatar
app.use('/api/jobs', jobsRoutes); // Job search API
app.use('/api/youtube', youtubeRoutes); // YouTube API (FREE, no key needed!)
app.use('/api/admin', adminRoutes); // Creator admin control (PROTECTED)
app.use('/api/analytics', analyticsRoutes); // Real-time analytics (tracks all requests)
app.use('/api/auth', authRoutes); // Authentication and user management

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Quantum AI Backend API',
    creator: 'Mohanraj - Cybersecurity Researcher & AI Developer',
    version: '1.0.0',
    status: global.QUANTUM_LOCKDOWN ? 'lockdown' : 'running',
    endpoints: {
      health: '/api/health',
      ai: '/api/ai',
      ollama: '/api/ollama',
      mockAi: '/api/mock-ai',
      chat: '/api/chat (Unified multi-provider chat)',
      jobs: '/api/jobs (Real-time job search)',
      youtube: '/api/youtube (FREE YouTube RSS)',
      admin: '/api/admin (Creator control - PROTECTED)',
      analytics: '/api/analytics (Real-time user tracking)',
      auth: '/api/auth (User authentication)'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// WebSocket server for real-time communication
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      
      // Echo back for now - can be extended for real-time AI streaming
      ws.send(JSON.stringify({
        type: 'response',
        data: `Received: ${data.message}`
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON message'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Quantum AI Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});