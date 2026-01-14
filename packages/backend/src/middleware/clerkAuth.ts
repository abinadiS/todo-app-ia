import { clerkMiddleware, getAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';

// Initialize Clerk middleware
export const clerkAuthMiddleware = clerkMiddleware();

// Middleware to require authentication and sync user
export function requireAuthMiddleware(prisma: PrismaClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = getAuth(req);

      if (!auth.userId) {
        throw new UnauthorizedError('Authentication required');
      }

      // Attach userId to request
      req.userId = auth.userId;

      // Sync user to database if not exists
      const existingUser = await prisma.user.findUnique({
        where: { id: auth.userId },
      });

      if (!existingUser) {
        // Get email from session claims (try different possible locations)
        const email =
          (auth.sessionClaims?.email as string) ||
          (auth.sessionClaims?.primary_email as string) ||
          (auth.sessionClaims?.email_address as string) ||
          `${auth.userId}@clerk.user`;

        logger.info(`Creating new user: ${auth.userId} with email: ${email}`);

        await prisma.user.create({
          data: {
            id: auth.userId,
            email: email,
          },
        });
      }

      next();
    } catch (error) {
      logger.error('Auth middleware error:', error);
      next(error);
    }
  };
}
