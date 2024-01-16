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

router.route('/submit').post(validateTrendInput, submitTrend);
router.route('/').get(getAllTrends);
router.route('/my-trends').get(getUserTrends);
router.post(validateTrendInput, adminOnly, createTrend);
//route for base URL with route param
router
  .route('/:id')
  .get(validateIdParam, getSingleTrend)
  .patch(validateTrendInput, validateIdParam, adminOnly, editTrend)
  .delete(validateIdParam, adminOnly, deleteTrend);
router.patch('/:id/approve', adminOnly, approveTrend);
export default router;
