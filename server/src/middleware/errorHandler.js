import { AppError } from '../errors/AppError.js';

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, 'Route not found.', 'ROUTE_NOT_FOUND'));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'Request body contains invalid JSON.' },
    });
  }

  const statusCode = error.statusCode ?? 500;
  const code = error.code ?? 'INTERNAL_SERVER_ERROR';
  const message = statusCode >= 500 ? 'An unexpected error occurred.' : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({ error: { code, message } });
}
