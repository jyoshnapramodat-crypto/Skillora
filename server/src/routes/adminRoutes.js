import express from 'express';
import { adminLogin, getAdminMetrics } from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Admin login
router.post('/login', adminLogin);

// Protected: Admin metrics
router.get('/metrics', protect, requireAdmin, getAdminMetrics);

export default router;
