import express from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  toggleGoal,
  deleteGoal
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All goal routes are protected

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.route('/:id/toggle')
  .patch(toggleGoal);

export default router;

