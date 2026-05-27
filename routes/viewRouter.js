import { Router } from 'express';
import {
  getApprovedViewFlow,
  getViewTrendPreview,
  getViewCategoryPreview,
} from '../controllers/viewController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/approved-view-flow', authenticateUser, getApprovedViewFlow);
router.get('/trend-preview/:slug', authenticateUser, getViewTrendPreview);
router.get('/category-preview/:categoryValue', authenticateUser, getViewCategoryPreview);

export default router;