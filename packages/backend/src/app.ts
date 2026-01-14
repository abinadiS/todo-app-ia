import express from 'express';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { clerkAuthMiddleware } from './middleware/clerkAuth';
import { createRoutes } from './routes';

export function createApp(prisma: PrismaClient) {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(corsMiddleware);

  // Clerk middleware (must be before routes)
  app.use(clerkAuthMiddleware);

  // Body parsing
  app.use(express.json({ limit: '10kb' }));

  // Health check (no auth required)
  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api', createRoutes(prisma));

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}
