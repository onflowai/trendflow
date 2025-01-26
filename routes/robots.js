import express from 'express';
import { serveRobotsTxt } from '../controllers/robotsController.js';

const router = express.Router();

router.get('/robots.txt', serveRobotsTxt);

export default router;
