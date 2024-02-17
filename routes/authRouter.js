import { Router } from 'express';
import { login, logout, register } from '../controllers/authController.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegisterInput, register); //post route to register with 'register' controller
router.post('/login', validateLoginInput, login); //post route to login with 'login' controller
router.get('/logout', logout); //get route to logging out

export default router;
