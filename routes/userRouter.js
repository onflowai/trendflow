import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/userController.js';
import {
  authenticateUser,
  authorizedPermissions,
} from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../middleware/validationMiddleware.js';
import uploadMulter from '../middleware/multerMiddleware.js';

const router = Router();

router.get('/current-user', authenticateUser, getCurrentUser);
router.get(
  '/admin/app-stats',
  authenticateUser,
  authorizedPermissions('admin'),
  getApplicationStats
);
router.patch(
  '/update-user',
  uploadMulter.single('profile_img'),
  authenticateUser,
  validateUserUpdate,
  updateUser
);

export default router;
