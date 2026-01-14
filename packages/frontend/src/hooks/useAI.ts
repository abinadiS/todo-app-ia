import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../services/api';
import { createTaskService } from '../services/taskService';
import { TASK_KEYS } from './useTasks';

export function useTaskSummary() {
  const api = useApi();
  const taskService = createTaskService(api);

  return useMutation({
    mutationFn: () => taskService.getTaskSummary(),
  });
}

export function useSuggestPriorities() {
  const queryClient = useQueryClient();
  const api = useApi();
  const taskService = createTaskService(api);

  return useMutation({
    mutationFn: (taskIds?: string[]) => taskService.suggestPriorities(taskIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
    },
  });
}

export function useCompleteDescription() {
  const api = useApi();
  const taskService = createTaskService(api);

  return useMutation({
    mutationFn: (title: string) => taskService.completeDescription(title),
  });
}
