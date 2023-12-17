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

// router.get('/', getAllTrends);
// router.post('/', createTrend)
//route for base URL
router.route('/').get(getAllTrends).post(createTrend);
//route for base URL with route param
router.route('/:id').get(getSingleTrend).patch(editTrend).delete(deleteTrend);

export default router;
