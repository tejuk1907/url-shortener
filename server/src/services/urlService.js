import { randomBytes, randomUUID } from 'node:crypto';

import { AppError } from '../errors/AppError.js';

const SHORT_CODE_BYTES = 6;
const MAX_CODE_ATTEMPTS = 10;

function validateUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, 'A URL is required.', 'INVALID_URL');
  }

  const originalUrl = value.trim();
  let parsedUrl;

  try {
    parsedUrl = new URL(originalUrl);
  } catch {
    throw new AppError(400, 'Enter a valid HTTP or HTTPS URL.', 'INVALID_URL');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new AppError(400, 'Only HTTP and HTTPS URLs are supported.', 'INVALID_URL');
  }

  return originalUrl;
}

function generateShortCode() {
  return randomBytes(SHORT_CODE_BYTES).toString('base64url');
}

export class UrlService {
  constructor(repository, baseUrl) {
    this.repository = repository;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  create(value) {
    const originalUrl = validateUrl(value);
    let shortCode;

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
      const candidate = generateShortCode();
      if (!this.repository.exists(candidate)) {
        shortCode = candidate;
        break;
      }
    }

    if (!shortCode) {
      throw new AppError(503, 'Unable to generate a short URL. Try again.', 'CODE_GENERATION_FAILED');
    }

    return this.repository.create({
      id: randomUUID(),
      shortCode,
      shortUrl: `${this.baseUrl}/${shortCode}`,
      originalUrl,
      clicks: 0,
      createdAt: new Date().toISOString(),
    });
  }

  list() {
    return this.repository.findAll();
  }

  remove(shortCode) {
    if (!this.repository.delete(shortCode)) {
      throw new AppError(404, 'Short URL not found.', 'URL_NOT_FOUND');
    }
  }

  resolve(shortCode) {
    const url = this.repository.incrementClicks(shortCode);
    if (!url) {
      throw new AppError(404, 'Short URL not found.', 'URL_NOT_FOUND');
    }

    return url.originalUrl;
  }
}
