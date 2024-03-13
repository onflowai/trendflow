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
} from '../controllers/trendController.js';
import {
  validateSlugParam,
  validateTrendInput,
} from '../middleware/validationMiddleware.js';
import {
  authenticateUser,
  authorizedPermissions,
  testUserUnauthorized,
} from '../middleware/authMiddleware.js';
import { incrementViews } from '../middleware/trendAnalyticsMiddleware.js';
/**
 *
 */
router.route('/submit').post(authenticateUser, validateTrendInput, submitTrend);
router.route('/').get(getApprovedTrends); //NOTE user does not need to have an account to see Trends
router
  .route('/admin/all-trends')
  .get(authenticateUser, authorizedPermissions('admin'), getAllTrends);
router
  .route('/my-trends')
  .get(testUserUnauthorized, authenticateUser, getUserTrends);
router.post(
  '/add-trend',
  testUserUnauthorized,
  authenticateUser,
  validateTrendInput,
  authorizedPermissions('admin'),
  createTrend
); //route for base URL with route param NOTE user does not need to have an account to see each Trend
router.route('/:slug').get(validateSlugParam, incrementViews, getSingleTrend); //route to trend page
router
  .route('/edit/:slug')
  .get(validateSlugParam, getSingleTrend)
  .patch(
    testUserUnauthorized,
    authenticateUser,
    validateTrendInput,
    validateSlugParam,
    authorizedPermissions('admin'),
    editTrend
  )
  .delete(
    testUserUnauthorized,
    authenticateUser,
    validateSlugParam,
    authorizedPermissions('admin'),
    deleteTrend
  );
router.patch(
  '/:slug/approve',
  testUserUnauthorized,
  authenticateUser,
  authorizedPermissions('admin'),
  approveTrend
);
export default router;
