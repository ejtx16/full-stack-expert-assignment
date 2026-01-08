import { Request, Response } from 'express';
import { taskService } from '../services/taskService.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.js';

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const input = req.body as CreateTaskInput;

  const task = await taskService.createTask(userId, input);

  sendSuccess(res, { task }, 'Task created successfully', 201);
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const query = req.query as unknown as TaskQueryInput;

  const result = await taskService.getTasks(userId, query);

  sendPaginated(
    res,
    result.tasks,
    {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
    'Tasks retrieved successfully'
  );
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const task = await taskService.getTaskById(id!, userId);

  sendSuccess(res, { task }, 'Task retrieved successfully');
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const input = req.body as UpdateTaskInput;

  const task = await taskService.updateTask(id!, userId, input);

  sendSuccess(res, { task }, 'Task updated successfully');
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  await taskService.deleteTask(id!, userId);

  sendSuccess(res, null, 'Task deleted successfully');
});

export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const stats = await taskService.getTaskStats(userId);

  sendSuccess(res, { stats }, 'Task statistics retrieved successfully');
});

