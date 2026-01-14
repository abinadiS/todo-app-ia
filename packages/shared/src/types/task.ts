export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  aiPriority: TaskPriority | null;
  aiSummary: string | null;
  aiGeneratedDesc: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  aiPriority?: TaskPriority;
}

export interface TaskFilters {
  status?: TaskStatus;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}
