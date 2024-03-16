import { Router } from 'express';
//Instantiating the Router
const router = Router();
import {
  getApprovedTrends,
  approveTrend,
  submitTrend,
  getAllTrends,
  getUserTrends,
  getSingleTrend,
  createTrend,
  deleteTrend,
  editTrend,
  adminStats,
} from '../controllers/trendController.js';
import {
  validateSlugParam,
  validateTrendInput,
} from '../middleware/validationMiddleware.js';
import {
  authenticateUser,
  authorizedPermissions,
} from '../middleware/authMiddleware.js';
import { incrementViews } from '../middleware/trendAnalyticsMiddleware.js';
/**
 *First, authenticate the user to determine their role
 */
router
  .route('/submit')
  .post(
    authenticateUser,
    authorizedPermissions('write'),
    validateTrendInput,
    submitTrend
  );
router.route('/').get(getApprovedTrends); //NOTE user does not need to have an account to see Trends
router.route('/admin/stats').get(adminStats);
router
  .route('/admin/all-trends')
  .get(authenticateUser, authorizedPermissions('delete'), getAllTrends);
router.route('/my-trends').get(authenticateUser, getUserTrends);
router.post(
  '/add-trend',
  authenticateUser,
  authorizedPermissions('write'),
  validateTrendInput,
  createTrend
); //route for base URL with route param NOTE user does not need to have an account to see each Trend
router.route('/:slug').get(validateSlugParam, incrementViews, getSingleTrend); //route to trend page
router
  .route('/edit/:slug')
  .get(validateSlugParam, getSingleTrend)
  .patch(
    authenticateUser,
    authorizedPermissions('write'),
    validateTrendInput,
    validateSlugParam,
    editTrend
  )
  .delete(
    authenticateUser,
    authorizedPermissions('delete'),
    validateSlugParam,
    deleteTrend
  );
router.patch(
  '/:slug/approve',
  authenticateUser,
  authorizedPermissions('write'),
  approveTrend
);
export default router;
