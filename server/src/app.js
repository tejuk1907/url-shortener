import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { config } from './config.js';
import { createUrlController } from './controllers/urlController.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { UrlRepository } from './repositories/urlRepository.js';
import { createUrlRouter } from './routes/urlRoutes.js';
import { UrlService } from './services/urlService.js';

const passThrough = (_req, _res, next) => next();

export function createApp(options = {}) {
  const app = express();
  const repository = options.repository ?? new UrlRepository();
  const baseUrl = options.baseUrl ?? config.baseUrl;
  const clientOrigin = options.clientOrigin ?? config.clientOrigin;
  const urlService = new UrlService(repository, baseUrl);
  const controller = createUrlController(urlService);
  const creationLimiter = options.disableRateLimit
    ? passThrough
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 30,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: {
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many short URLs created. Try again later.',
          },
        },
      });

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/urls', createUrlRouter(controller, creationLimiter));
  app.get('/:shortCode', controller.redirect);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
