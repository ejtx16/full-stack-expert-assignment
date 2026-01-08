import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error(err.message, { stack: err.stack });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'VALIDATION_ERROR', 'Invalid request data', 400, details);
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as { code?: string };
    if (prismaError.code === 'P2002') {
      sendError(res, 'CONFLICT', 'A record with this value already exists', 409);
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'NOT_FOUND', 'Record not found', 404);
      return;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'UNAUTHORIZED', 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'UNAUTHORIZED', 'Token expired', 401);
    return;
  }

  // Default to 500 internal server error
  const message = config.isProduction ? 'Internal server error' : err.message;
  sendError(res, 'INTERNAL_ERROR', message, 500);
};

// 404 handler
export const notFoundHandler = (_req: Request, res: Response): void => {
  sendError(res, 'NOT_FOUND', 'Route not found', 404);
};

