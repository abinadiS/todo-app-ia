import type { Task, TaskPriority } from './task';

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// AI Responses
export interface TaskSummaryResponse {
  summary: string;
  totalPending: number;
  estimatedTime?: string;
}

export interface PrioritySuggestion {
  taskId: string;
  priority: TaskPriority;
  reason: string;
}

export interface DescriptionCompletionResponse {
  description: string;
  confidence: number;
}
