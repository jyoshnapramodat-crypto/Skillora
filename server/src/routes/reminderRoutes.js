import express from 'express';
import {
  getReminders,
  updateReminders
} from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReminders)
  .put(updateReminders);

export default router;

