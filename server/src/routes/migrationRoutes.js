import express from 'express';
import { importLocalStorageData } from '../controllers/migrationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Migration endpoint is protected

router.post('/import', importLocalStorageData);

export default router;

