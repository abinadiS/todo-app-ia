import type { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/aiService';
import { TaskService } from '../services/taskService';
import type { CompleteDescriptionInput, SuggestPrioritiesInput } from '../dto/ai.dto';

export class AIController {
  constructor(
    private aiService: AIService,
    private taskService: TaskService
  ) {}

  generateSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const pendingTasks = await this.taskService.getPendingTasks(userId);
      const result = await this.aiService.generateTaskSummary(pendingTasks);

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  suggestPriorities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { taskIds } = req.body as SuggestPrioritiesInput;

      let tasks;
      if (taskIds && taskIds.length > 0) {
        tasks = await this.taskService.getTasksByIds(taskIds, userId);
      } else {
        tasks = await this.taskService.getPendingTasks(userId);
      }

      const priorities = await this.aiService.suggestPriorities(tasks);

      // Update tasks with suggested priorities
      for (const priority of priorities) {
        await this.taskService.updateAIPriority(
          priority.taskId,
          userId,
          priority.priority
        );
      }

      res.json({ data: priorities });
    } catch (error) {
      next(error);
    }
  };

  completeDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body as CompleteDescriptionInput;
      const result = await this.aiService.completeDescription(title);

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
