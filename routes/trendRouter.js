import { Router } from 'express';
//Instantiating the Router
const router = Router();
import {
  getAllTrends,
  getSingleTrend,
  createTrend,
  deleteTrend,
  editTrend,
} from '../controllers/trendController.js';
import {
  validateIdParam,
  validateTrendInput,
} from '../middleware/validationMiddleware.js';

// router.get('/', getAllTrends);
// router.post('/', createTrend)
//route for base URL
router.route('/').get(getAllTrends).post(validateTrendInput, createTrend);
//route for base URL with route param
router
  .route('/:id')
  .get(validateIdParam, getSingleTrend)
  .patch(validateTrendInput, validateIdParam, editTrend)
  .delete(validateIdParam, deleteTrend);

export default router;
