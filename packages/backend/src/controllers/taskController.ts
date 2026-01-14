import type { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../dto/task.dto';

// Extend Express Request to include userId from Clerk
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export class TaskController {
  constructor(private taskService: TaskService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const query = req.query as unknown as TaskQueryInput;
      const result = await this.taskService.findAll(userId, query);

      res.json({
        data: result.tasks,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const task = await this.taskService.findById(id, userId);

      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const data = req.body as CreateTaskInput;
      const task = await this.taskService.create(userId, data);

      res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const data = req.body as UpdateTaskInput;
      const task = await this.taskService.update(id, userId, data);

      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      await this.taskService.softDelete(id, userId);

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const task = await this.taskService.restore(id, userId);

      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  };
}
