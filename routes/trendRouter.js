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
  validateIdParam,
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
  .route('/:id')
  .get(validateIdParam, getSingleTrend)
  .patch(
    authenticateUser,
    validateTrendInput,
    validateIdParam,
    adminOnly,
    editTrend
  )
  .delete(authenticateUser, validateIdParam, adminOnly, deleteTrend);
router.patch('/:id/approve', authenticateUser, adminOnly, approveTrend);
export default router;
