import { PrismaClient, type Task, type TaskStatus } from '@prisma/client';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../dto/task.dto';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string, query: TaskQueryInput) {
    const { status, page, limit, includeDeleted } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status: status as TaskStatus }),
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundError('Task');
    }

    if (task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task');
    }

    return task;
  }

  async create(userId: string, data: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateTaskInput): Promise<Task> {
    await this.findById(id, userId); // Validates ownership

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId); // Validates ownership

    await this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundError('Task');
    }

    if (task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task');
    }

    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async getPendingTasks(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTasksByIds(ids: string[], userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        id: { in: ids },
        userId,
        deletedAt: null,
      },
    });
  }

  async updateAIPriority(
    id: string,
    userId: string,
    priority: string
  ): Promise<Task> {
    await this.findById(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: { aiPriority: priority as any },
    });
  }
}
