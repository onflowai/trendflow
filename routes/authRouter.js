import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { validateRegisterInput } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegisterInput, register); //post route to register with 'register' controller
router.post('/login', login); //post route to login with 'login' controller

export default router;
