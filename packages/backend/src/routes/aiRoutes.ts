import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { validateRequest } from '../middleware/validateRequest';
import { CompleteDescriptionDto, SuggestPrioritiesDto } from '../dto/ai.dto';

export function createAIRoutes(aiController: AIController): Router {
  const router = Router();

  router.post('/summary', aiController.generateSummary);

  router.post(
    '/priorities',
    validateRequest({ body: SuggestPrioritiesDto }),
    aiController.suggestPriorities
  );

  router.post(
    '/complete-description',
    validateRequest({ body: CompleteDescriptionDto }),
    aiController.completeDescription
  );

  return router;
}
