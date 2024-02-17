import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/userController.js';

const router = Router();

router.get('/current-user', getCurrentUser);
router.post('/admin/app-stats', getApplicationStats);
router.get('/update-user', updateUser);

export default router;
