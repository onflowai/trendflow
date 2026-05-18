import express from 'express';
import {
  authenticateUser,
  authorizedAdmin,
  requireAuthUserID,
} from '../middleware/authMiddleware.js';
import {
  getSelectIconData,
  adminCreateCategory,
  adminCreateTechnology,
} from '../controllers/iconController.js';

const router = express.Router();

router.get('/icon-data', authenticateUser, getSelectIconData);
router.post('/icon-data/category', authenticateUser, authorizedAdmin, adminCreateCategory);
router.post('/icon-data/technology', authenticateUser, authorizedAdmin, adminCreateTechnology)

export default router;
