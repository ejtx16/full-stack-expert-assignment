import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.js';
import type { TaskStatus, TaskPriority, Prisma } from '@prisma/client';

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTasks {
  tasks: TaskResponse[];
  total: number;
  page: number;
  limit: number;
}

export class TaskService {
  /**
   * Create a new task
   */
  async createTask(userId: string, input: CreateTaskInput): Promise<TaskResponse> {
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate,
        userId,
      },
    });

    return task;
  }

  /**
   * Get all tasks for a user with pagination and filtering
   */
  async getTasks(userId: string, query: TaskQueryInput): Promise<PaginatedTasks> {
    const { page, limit, status, priority, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Build order by clause
    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page,
      limit,
    };
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId: string, userId: string): Promise<TaskResponse> {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check ownership
    if (task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task');
    }

    return task;
  }

  /**
   * Update a task
   */
  async updateTask(
    taskId: string,
    userId: string,
    input: UpdateTaskInput
  ): Promise<TaskResponse> {
    // First check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    if (existingTask.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task');
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.priority !== undefined && { priority: input.priority }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      },
    });

    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    // First check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    if (existingTask.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  /**
   * Get task statistics for a user
   */
  async getTaskStats(userId: string): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  }> {
    const [total, todo, inProgress, completed] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'TODO' } }),
      prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
    ]);

    return { total, todo, inProgress, completed };
  }
}

export const taskService = new TaskService();

