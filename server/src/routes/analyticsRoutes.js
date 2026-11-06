import express from 'express';
import {
  getDashboardStats,
  getChartData
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Analytics routes are protected

router.get('/dashboard', getDashboardStats);
router.get('/charts', getChartData);

export default router;

