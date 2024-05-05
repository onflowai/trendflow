import { Router } from 'express';
import { logVisit } from '../controllers/visitController.js';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
  saveUserTrend,
} from '../controllers/userController.js';
import {
  authenticateUser,
  authorizedPermissions,
} from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../middleware/validationMiddleware.js';
import { uploadMulter, processImage } from '../middleware/imageMiddleware.js';

const router = Router();

router.get('/current-user', authenticateUser, getCurrentUser);
router.get(
  '/admin/app-stats',
  authenticateUser,
  authorizedPermissions('delete'),
  getApplicationStats
);
router.patch(
  '/update-user',
  authenticateUser,
  authorizedPermissions('write'),
  uploadMulter.single('profile_img'),
  processImage,
  validateUserUpdate,
  updateUser
);
router.post('/visits', logVisit);

router.patch('/save-trend', authenticateUser, saveUserTrend);

export default router;
