import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, getErrorMessage } from '../services/api';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, PaginationParams } from '../types';
import toast from 'react-hot-toast';

export const TASKS_QUERY_KEY = 'tasks';
export const TASK_STATS_QUERY_KEY = 'taskStats';

export function useTasks(params: PaginationParams & TaskFilters = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, params],
    queryFn: () => tasksApi.getAll(params),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: [TASK_STATS_QUERY_KEY],
    queryFn: () => tasksApi.getStats(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TASK_STATS_QUERY_KEY] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => tasksApi.update(id, data),
    onSuccess: (updatedTask: Task) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TASK_STATS_QUERY_KEY] });
      queryClient.setQueryData([TASKS_QUERY_KEY, updatedTask.id], updatedTask);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TASK_STATS_QUERY_KEY] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

