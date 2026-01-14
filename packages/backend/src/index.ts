import { PrismaClient } from '@prisma/client';
import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Create and start the app
    const app = createApp(prisma);

    app.listen(config.PORT, () => {
      logger.info(`Server running on http://localhost:${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

main();
