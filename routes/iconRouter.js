import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getSelectIconData } from '../controllers/iconController.js';

const router = express.Router();

router.get('/icon-data', authenticateUser, getSelectIconData); // preserving original endpoint "/icon-data" from trendController

export default router;
