import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/userController.js';
import {
  authenticateUser,
  authorizedPermissions,
  testUserUnauthorized,
} from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../middleware/validationMiddleware.js';
import { uploadMulter, processImage } from '../middleware/imageMiddleware.js';

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
  testUserUnauthorized,
  uploadMulter.single('profile_img'),
  processImage,
  authenticateUser,
  validateUserUpdate,
  updateUser
);

export default router;
