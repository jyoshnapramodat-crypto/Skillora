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
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDemoUser } from './utils/seedDemo.js';

// Resolve directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Initialize MongoDB connection
connectDB().then(async () => {
  // Ensure demo user is pre-seeded on startup
  try {
    await seedDemoUser();
  } catch (err) {
    console.error('[Startup] Demo user seed warning:', err.message);
  }
});

// Middleware configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
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
app.use('/api/skills', skillRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/migration', migrationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Skillora Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

