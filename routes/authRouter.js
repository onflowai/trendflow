import { Router } from 'express';
import {
  login,
  logout,
  register,
  verifyCode,
  guestLogin,
  verifyEmail,
  resendEmail,
  upgradeAccount
} from '../controllers/authController.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';
import {
  authenticateUser,
  requireAuthUserID 
} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRegisterInput, register); //post route to register with 'register' controller
router.post('/login', validateLoginInput, login); //post route to login with 'login' controller
router.get('/logout', authenticateUser, logout); //get route to logging out
router.post('/guest-login', guestLogin);
router.get('/verify-email', verifyEmail);
router.post('/resend-email', resendEmail);
router.post('/verify-code', verifyCode);
//router.post('/upgrade-account', authenticateUser, requireAuthUserID, upgradeAccount); 

export default router;
