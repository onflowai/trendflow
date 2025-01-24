import { Router } from 'express';
import {
  login,
  logout,
  register,
  guestLogin,
} from '../controllers/authController.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';
import { guestLoginLimiter } from '../utils/rateLimiter.js';

const router = Router();

router.post('/register', validateRegisterInput, register); //post route to register with 'register' controller
router.post('/login', validateLoginInput, login); //post route to login with 'login' controller
router.get('/logout', logout); //get route to logging out
router.post('/guest-login', guestLoginLimiter, guestLogin);

export default router;
