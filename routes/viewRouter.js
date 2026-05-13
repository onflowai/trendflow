import { Router } from 'express';
import {
  getApprovedViewFlow,
  getViewTrendPreview,
  getViewCategoryPreview,
} from '../controllers/viewController.js';

const router = Router();

router.get('/approved-view-flow', getApprovedViewFlow);
router.get('/trend-preview/:slug', getViewTrendPreview);
router.get('/category-preview/:categoryValue', getViewCategoryPreview);

export default router;