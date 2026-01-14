import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError } from '../utils/errors';

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

      if (!existingUser && auth.sessionClaims?.email) {
        await prisma.user.create({
          data: {
            id: auth.userId,
            email: auth.sessionClaims.email as string,
          },
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Export requireAuth from Clerk for route-level protection
export { requireAuth };
