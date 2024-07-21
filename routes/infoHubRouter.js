import { Router } from 'express';
import {
  createInfoHub,
  getAllInfoHub,
  deleteInfoHub,
} from '../controllers/infoHubController.js';
import {
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions,
} from '../middleware/authMiddleware.js';
import { uploadMulter, processSVG } from '../middleware/imageMiddleware.js';

const router = Router();
router.post(
  '/',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('delete'),
  uploadMulter.single('file'),
  processSVG,
  createInfoHub
); //same route can be used as long as it is a different fetch
router.get('/', getAllInfoHub);
router.delete('/delete/:id', authenticateUser, authorizedAdmin, deleteInfoHub);

export default router;
