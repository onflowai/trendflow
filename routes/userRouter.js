import { Router } from 'express';
import { logVisit } from '../controllers/visitController.js';
import {
  updateUser,
  togglePrivacy,
  saveUserTrend,
  getCurrentUser,
  removeUserTrend,
  saveUserFilters,
  updateUserImage,
  addGithubUsername,
  getUserSavedTrends,
  getUserSavedFilters,
  deleteUserSavedFilters,
  getAdminApplicationStats,
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
  getAdminApplicationStats
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
router.patch(
  '/upload-user-image',
  authenticateUser,
  authorizedPermissions('write'),
  uploadMulter.single('profile_img'), // Handle file upload
  processImage, // Middleware to process image
  updateUserImage // A new controller function to handle image upload
);
router.post('/visits', logVisit);
router.patch('/save-trend', authenticateUser, saveUserTrend);
router.patch('/remove-trend', authenticateUser, removeUserTrend);
router.get('/saved-trends', authenticateUser, getUserSavedTrends);
router.patch('/add-github-username', authenticateUser, addGithubUsername);
router.patch('/toggle-privacy', authenticateUser, togglePrivacy);
router.post('/save-filters', authenticateUser, saveUserFilters);
router.get('/get-saved-filters', authenticateUser, getUserSavedFilters);
router.delete('/delete-filters', authenticateUser, deleteUserSavedFilters);

export default router;
