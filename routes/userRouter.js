import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/current-user', authenticateUser, getCurrentUser);
router.get('/admin/app-stats', authenticateUser, getApplicationStats);
router.patch('/update-user', validateUserUpdate, authenticateUser, updateUser);

export default router;
