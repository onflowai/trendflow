import { Router } from 'express';
//Instantiating the Router
const router = Router();
import {
  editTrend,
  submitTrend,
  createTrend,
  deleteTrend,
  getTrendSVG,
  searchTrends,
  getAllTrends,
  approveTrend,
  getUserTrends,
  getSingleTrend,
  uploadTrendSVG,
  getApprovedTrends,
  updateTrendManual,
  getTopViewedTrends,
  approveTrendManual,
  updateTrendBlogAdmin,
  submitTrendForApproval,
} from '../controllers/trendController.js';
import { rateLimitSubmitTrend } from '../middleware/rateLimitMiddleware.js';
import { adminStats, appTrendStats } from '../controllers/visitController.js';
import {
  validateSlugParam,
  validateTrendInput,
} from '../middleware/validationMiddleware.js';
import {
  authenticateUser,
  authorizedPermissions,
  authorizedAdmin,
} from '../middleware/authMiddleware.js';
import { incrementViews } from '../middleware/trendAnalyticsMiddleware.js';
import { uploadMulter, processSVG } from '../middleware/imageMiddleware.js';
/**
 *First, authenticate the user to determine their role
 */
router.get('/search', authenticateUser, authorizedAdmin, searchTrends);
router.get(
  '/get-trend-svg/:slug',
  authenticateUser,
  authorizedPermissions('read'),
  getTrendSVG
);
router.patch(
  '/upload-trend-svg/:slug',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('write'),
  uploadMulter.single('file'), // Handle file upload
  processSVG, // Middleware to handle SVG file
  uploadTrendSVG // Controller function to handle SVG upload
);
router
  .route('/submit')
  .post(
    authenticateUser,
    authorizedPermissions('write'),
    rateLimitSubmitTrend,
    validateTrendInput,
    submitTrend
  );
router.patch(
  '/:slug/submit-for-approval',
  authenticateUser,
  authorizedPermissions('write'),
  validateSlugParam,
  submitTrendForApproval
);
router.patch(
  '/:slug/update-trend-blog',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('write'),
  validateSlugParam,
  updateTrendBlogAdmin
);// admin-only blog edit
router.route('/').get(getApprovedTrends); //NOTE user does not need to have an account to see Trends
router.route('/top-viewed').get(getTopViewedTrends); //NOTE user does not need to have an account to see Top Trends
router.route('/admin/stats').get(adminStats);
router.route('/app/stats').get(authenticateUser, appTrendStats);
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
    authorizedAdmin,
    authorizedPermissions('delete'),
    validateTrendInput,
    validateSlugParam,
    editTrend
  )
  .delete(
    authenticateUser,
    authorizedAdmin,
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
router.patch(
  '/:slug/manual-update',
  authenticateUser,
  authorizedPermissions('write'),
  updateTrendManual
);
router.patch(
  '/:slug/manual-approve',
  authenticateUser,
  authorizedPermissions('write'),
  approveTrendManual
);
export default router;
