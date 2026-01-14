import { z } from 'zod';

export const TaskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const CreateTaskDto = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).optional(),
  status: TaskStatusEnum.optional().default('PENDING'),
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  status: TaskStatusEnum.optional(),
  aiPriority: TaskPriorityEnum.optional().nullable(),
});

export const TaskQueryDto = z.object({
  status: TaskStatusEnum.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  includeDeleted: z.coerce.boolean().default(false),
});

export const TaskIdParamDto = z.object({
  id: z.string().uuid('Invalid task ID'),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
export type TaskQueryInput = z.infer<typeof TaskQueryDto>;
