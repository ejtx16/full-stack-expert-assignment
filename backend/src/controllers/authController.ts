import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const result = await authService.register(input);

  sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    },
    'User registered successfully',
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await authService.login(input);

  sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    },
    'Login successful'
  );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as RefreshTokenInput;
  const tokens = await authService.refreshToken(refreshToken);

  sendSuccess(
    res,
    {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    'Token refreshed successfully'
  );
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // In a more complete implementation, you would invalidate the refresh token
  // by storing it in a blacklist or using a token versioning system
  sendSuccess(res, null, 'Logout successful');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await authService.getUserById(userId);

  sendSuccess(res, { user }, 'User retrieved successfully');
});

