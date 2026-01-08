import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/storage';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  PaginationParams,
  PaginatedResponse,
  SuccessResponse,
  TaskStats,
  User,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post<SuccessResponse<{ accessToken: string; refreshToken: string }>>(
            `${API_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          setTokens(accessToken, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post<SuccessResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post<SuccessResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<SuccessResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post<SuccessResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (
    params: PaginationParams & TaskFilters = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<Task>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await api.get<PaginatedResponse<Task>>(`/tasks?${queryParams.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get<SuccessResponse<{ task: Task }>>(`/tasks/${id}`);
    return response.data.data.task;
  },

  create: async (data: CreateTaskInput): Promise<Task> => {
    const response = await api.post<SuccessResponse<{ task: Task }>>('/tasks', data);
    return response.data.data.task;
  },

  update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await api.put<SuccessResponse<{ task: Task }>>(`/tasks/${id}`, data);
    return response.data.data.task;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  getStats: async (): Promise<TaskStats> => {
    const response = await api.get<SuccessResponse<{ stats: TaskStats }>>('/tasks/stats');
    return response.data.data.stats;
  },
};

// Error handling helper
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: { message?: string } }>;
    return axiosError.response?.data?.error?.message || axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export default api;

