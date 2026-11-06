import express from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  addTask,
  updateTask,
  deleteTask
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All skill routes are protected

router.route('/')
  .get(getSkills)
  .post(createSkill);

router.route('/:id')
  .get(getSkillById)
  .put(updateSkill)
  .delete(deleteSkill);

router.route('/:id/tasks')
  .post(addTask);

router.route('/:id/tasks/:taskId')
  .patch(updateTask)
  .delete(deleteTask);

export default router;

