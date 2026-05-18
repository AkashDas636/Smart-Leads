import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../middleware/validators.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, register);

// POST /api/auth/login
router.post('/login', loginValidator, login);

// GET /api/auth/me  (protected)
router.get('/me', authenticate, getMe);

export default router;
