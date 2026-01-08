import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdSchema,
} from '../validators/task.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks - Get all tasks for user
router.get(
  '/',
  validate({ query: taskQuerySchema }),
  taskController.getTasks
);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', taskController.getTaskStats);

// GET /api/tasks/:id - Get single task
router.get(
  '/:id',
  validate({ params: taskIdSchema }),
  taskController.getTaskById
);

// POST /api/tasks - Create new task
router.post(
  '/',
  validate({ body: createTaskSchema }),
  taskController.createTask
);

// PUT /api/tasks/:id - Update task
router.put(
  '/:id',
  validate({ params: taskIdSchema, body: updateTaskSchema }),
  taskController.updateTask
);

// DELETE /api/tasks/:id - Delete task
router.delete(
  '/:id',
  validate({ params: taskIdSchema }),
  taskController.deleteTask
);

export default router;

