import { z } from 'zod';

export const CompleteDescriptionDto = z.object({
  title: z.string().min(1, 'Title is required').max(255),
});

export const SuggestPrioritiesDto = z.object({
  taskIds: z.array(z.string().uuid()).optional(),
});

export type CompleteDescriptionInput = z.infer<typeof CompleteDescriptionDto>;
export type SuggestPrioritiesInput = z.infer<typeof SuggestPrioritiesDto>;
