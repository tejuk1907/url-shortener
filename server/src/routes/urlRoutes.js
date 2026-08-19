import { Router } from 'express';

export function createUrlRouter(controller, creationLimiter) {
  const router = Router();

  router.get('/', controller.list);
  router.post('/', creationLimiter, controller.create);
  router.delete('/:shortCode', controller.remove);

  return router;
}
