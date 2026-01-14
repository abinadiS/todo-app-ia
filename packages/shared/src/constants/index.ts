export const API_ROUTES = {
  TASKS: '/api/tasks',
  AI_SUMMARY: '/api/ai/summary',
  AI_PRIORITIES: '/api/ai/priorities',
  AI_COMPLETE_DESCRIPTION: '/api/ai/complete-description',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
