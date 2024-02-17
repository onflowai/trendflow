import { Router } from 'express';
//Instantiating the Router
const router = Router();
import {
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
  adminOnly,
  validateSlugParam,
  validateTrendInput,
} from '../middleware/validationMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
/**
 *
 */
router.route('/submit').post(authenticateUser, validateTrendInput, submitTrend);
router.route('/').get(authenticateUser, getAllTrends);
router.route('/my-trends').get(authenticateUser, getUserTrends);
router.post(
  '/add-trend',
  authenticateUser,
  validateTrendInput,
  adminOnly,
  createTrend
);
//route for base URL with route param
router
  .route('/:slug')
  .get(validateSlugParam, getSingleTrend)
  .patch(
    authenticateUser,
    validateTrendInput,
    validateSlugParam,
    adminOnly,
    editTrend
  )
  .delete(authenticateUser, validateSlugParam, adminOnly, deleteTrend);
router.patch('/:slug/approve', authenticateUser, adminOnly, approveTrend);
export default router;
