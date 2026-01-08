import { Router } from 'express';
import authRoutes from './auth.js';
import taskRoutes from './tasks.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;

