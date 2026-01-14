import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createTaskRoutes } from './taskRoutes';
import { createAIRoutes } from './aiRoutes';
import { TaskController } from '../controllers/taskController';
import { AIController } from '../controllers/aiController';
import { TaskService } from '../services/taskService';
import { AIService } from '../services/aiService';
import { requireAuthMiddleware } from '../middleware/clerkAuth';

export function createRoutes(prisma: PrismaClient): Router {
  const router = Router();

  // Initialize services
  const taskService = new TaskService(prisma);
  const aiService = new AIService();

  // Initialize controllers
  const taskController = new TaskController(taskService);
  const aiController = new AIController(aiService, taskService);

  // Auth middleware for all routes
  const authMiddleware = requireAuthMiddleware(prisma);

  // Register routes
  router.use('/tasks', authMiddleware, createTaskRoutes(taskController));
  router.use('/ai', authMiddleware, createAIRoutes(aiController));

  return router;
}
