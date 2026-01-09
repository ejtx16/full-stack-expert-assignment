import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/index.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';
import type { RegisterInput, LoginInput } from '../validators/auth.js';
import type { JwtPayload } from '../middleware/auth.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, config.bcryptRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(input: LoginInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  /**
   * Logout user
   * In a more complete implementation, you would store the refresh token
   * in a blacklist or use a token versioning system
   */
  async logout(userId: string): Promise<void> {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // In a production system, you would:
    // 1. Add the refresh token to a blacklist (Redis)
    // 2. Or increment a token version in the user record
    // 3. Or delete stored refresh tokens from database
    // For now, the client-side will remove the tokens
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(userId: string, email: string): AuthTokens {
    const payload: JwtPayload = { userId, email };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string | number,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as string | number,
    } as SignOptions);

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
