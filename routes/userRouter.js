import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/current-user', authenticateUser, getCurrentUser);
router.post('/admin/app-stats', authenticateUser, getApplicationStats);
router.get('/update-user', authenticateUser, updateUser);

export default router;
