import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.mjs';
import { forumsRouter } from './routes/forums.js';
import { usersRouter } from './routes/users.js';
import winston from 'winston';
import fs from 'fs';
import { eventsRouter } from './routes/events.js';
import { servicesRouter } from './routes/services.js';
import { notificationsRouter } from './routes/notifications.js';

// Load environment variables from parent directory's .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.set('trust proxy', true);

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log')
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

// Load configuration based on environment
let config;
(async () => {
  try {
    config = (process.env.NODE_ENV === 'production')
      ? await import('./config/production.cjs')
      : await import('./config/development.cjs');
    
    config = config.default;
    logger.info('Loaded configuration:', { 
      env: process.env.NODE_ENV,
      port: config.port,
      cors: config.cors.origin 
    });
  } catch (error) {
    logger.error('Failed to load configuration:', error);
    process.exit(1);
  }

  // CORS configuration
  app.use(cors(config.cors));

  // Rate limiting in production
  if (process.env.NODE_ENV === 'production' || config.security) {
    app.use(rateLimit({
      windowMs: config.security.timeWindow,
      max: config.security.maxRequests,
      // Configure rate limiter for proxy setup
      trustProxy: process.env.NODE_ENV === 'production',
      handler: (req, res) => {
        logger.warn('Rate limit exceeded:', {
          ip: req.ip,
          path: req.path
        });
        res.status(429).json({
          error: 'Too many requests, please try again later'
        });
      }
    }));
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    try {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  // Debug logging for file requests
  app.use('/api/uploads', (req, res, next) => {
    logger.info('File request:', req.path);
    logger.info('Full URL:', req.url);
    logger.info('Absolute path:', path.join(__dirname, 'uploads', req.path));
    next();
  });

  // Serve static files from uploads directory with absolute path
  const uploadsPath = path.join(__dirname, 'uploads');
  logger.info('Uploads directory path:', uploadsPath);
  app.use('/api/uploads', express.static(uploadsPath, {
    setHeaders: (res) => {
      res.set('Cache-Control', 'public, max-age=31536000');
    }
  }));

  // Routes with /api prefix
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/forums', forumsRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/notifications', notificationsRouter);

  // Error handling
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`
        🚀 Server is running in ${process.env.NODE_ENV || 'undefined'} mode
        🔊 Listening on 0.0.0.0:${PORT}
        📱 API URL: ${process.env.API_URL}
        🌐 Frontend URL: ${process.env.FRONTEND_URL}
        `);
      logger.info('NODE_ENV:', process.env.NODE_ENV);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    server.close(() => {
      logger.info('Server closed gracefully');
    });
  });

  process.on('SIGINT', () => {
    server.close(() => {
      logger.info('Server closed gracefully');
    });
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection:', reason);
    process.exit(1);
  });
})();
