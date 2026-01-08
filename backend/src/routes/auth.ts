import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.js';

const router = Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// POST /api/auth/register - Register new user
router.post(
  '/register',
  validate({ body: registerSchema }),
  authController.register
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  validate({ body: loginSchema }),
  authController.login
);

// POST /api/auth/refresh - Refresh access token
router.post(
  '/refresh',
  validate({ body: refreshTokenSchema }),
  authController.refresh
);

// POST /api/auth/logout - Logout user
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, authController.getMe);

export default router;

