import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateRequest } from '../middleware/validateRequest';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  TaskIdParamDto,
} from '../dto/task.dto';

export function createTaskRoutes(taskController: TaskController): Router {
  const router = Router();

  router.get(
    '/',
    validateRequest({ query: TaskQueryDto }),
    taskController.getAll
  );

  router.get(
    '/:id',
    validateRequest({ params: TaskIdParamDto }),
    taskController.getOne
  );

  router.post(
    '/',
    validateRequest({ body: CreateTaskDto }),
    taskController.create
  );

  router.patch(
    '/:id',
    validateRequest({ params: TaskIdParamDto, body: UpdateTaskDto }),
    taskController.update
  );

  router.delete(
    '/:id',
    validateRequest({ params: TaskIdParamDto }),
    taskController.delete
  );

  router.post(
    '/:id/restore',
    validateRequest({ params: TaskIdParamDto }),
    taskController.restore
  );

  return router;
}
