import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import migrationRoutes from './routes/migrationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDemoUser } from './utils/seedDemo.js';
import { ensureDefaultAdmin } from './controllers/adminController.js';

// Resolve directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Initialize MongoDB connection
connectDB()
  .then(async () => {
    // Ensure demo user is pre-seeded on startup
    try {
      await seedDemoUser();
      await ensureDefaultAdmin();
    } catch (err) {
      console.error('[Startup] Seed warning:', err.message);
    }
  })
  .catch((err) => {
    console.error('[Startup] Failed to connect to MongoDB initially:', err.message);
  });

// Allowed CORS origins (including wildcard for Render preview URLs if configured)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in full stack setup to prevent Render deployment CORS blocks
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Skillora API',
    version: '2.0.0 (MERN Full Stack)',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/migration', migrationRoutes);

// In production, serve frontend client build if dist folder exists
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// For non-API routes in production, serve index.html (SPA Fallback)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Skillora Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Skillora Server] Error: Port ${PORT} is already in use by another running process.`);
    console.error(`[Skillora Server] Please stop the other process or run: npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    console.error('[Skillora Server] Server error:', err);
  }
});

