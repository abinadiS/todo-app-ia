import type { AxiosInstance } from 'axios';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  PaginatedResponse,
  TaskSummaryResponse,
  PrioritySuggestion,
  DescriptionCompletionResponse,
} from '@todo/shared';

export function createTaskService(api: AxiosInstance) {
  return {
    async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.page) params.set('page', filters.page.toString());
      if (filters?.limit) params.set('limit', filters.limit.toString());
      if (filters?.includeDeleted) params.set('includeDeleted', 'true');

      const response = await api.get(`/api/tasks?${params.toString()}`);
      return response.data;
    },

    async getTask(id: string): Promise<Task> {
      const response = await api.get(`/api/tasks/${id}`);
      return response.data.data;
    },

    async createTask(data: CreateTaskInput): Promise<Task> {
      const response = await api.post('/api/tasks', data);
      return response.data.data;
    },

    async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
      const response = await api.patch(`/api/tasks/${id}`, data);
      return response.data.data;
    },

    async deleteTask(id: string): Promise<void> {
      await api.delete(`/api/tasks/${id}`);
    },

    async restoreTask(id: string): Promise<Task> {
      const response = await api.post(`/api/tasks/${id}/restore`);
      return response.data.data;
    },

    // AI endpoints
    async getTaskSummary(): Promise<TaskSummaryResponse> {
      const response = await api.post('/api/ai/summary');
      return response.data.data;
    },

    async suggestPriorities(taskIds?: string[]): Promise<PrioritySuggestion[]> {
      const response = await api.post('/api/ai/priorities', { taskIds });
      return response.data.data;
    },

    async completeDescription(title: string): Promise<DescriptionCompletionResponse> {
      const response = await api.post('/api/ai/complete-description', { title });
      return response.data.data;
    },
  };
}

export type TaskServiceType = ReturnType<typeof createTaskService>;
