import express from 'express';
import {
  getPortfolioSettings,
  updatePortfolioSettings,
  getPublicPortfolio
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - Anyone with the link can view public portfolio
router.get('/public/:publicId', getPublicPortfolio);

// Protected routes for managing portfolio settings
router.use(protect);
router.route('/settings')
  .get(getPortfolioSettings)
  .put(updatePortfolioSettings);

export default router;

