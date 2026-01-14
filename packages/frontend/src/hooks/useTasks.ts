import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../services/api';
import { createTaskService } from '../services/taskService';
import type { CreateTaskInput, UpdateTaskInput, TaskStatus } from '@todo/shared';

export const TASK_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_KEYS.all, 'list'] as const,
  list: (filters: { status?: TaskStatus }) => [...TASK_KEYS.lists(), filters] as const,
  details: () => [...TASK_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TASK_KEYS.details(), id] as const,
};

export function useTasks(status?: TaskStatus | 'ALL') {
  const api = useApi();
  const taskService = createTaskService(api);

  return useQuery({
    queryKey: TASK_KEYS.list({ status: status === 'ALL' ? undefined : status }),
    queryFn: () =>
      taskService.getTasks({
        status: status === 'ALL' ? undefined : status,
      }),
  });
}

export function useTask(id: string) {
  const api = useApi();
  const taskService = createTaskService(api);

  return useQuery({
    queryKey: TASK_KEYS.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const api = useApi();
  const taskService = createTaskService(api);

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const api = useApi();
  const taskService = createTaskService(api);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskService.updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(id) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const api = useApi();
  const taskService = createTaskService(api);

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
    },
  });
}
