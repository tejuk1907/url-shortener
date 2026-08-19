import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';

describe('URL API', () => {
  let app;

  beforeEach(() => {
    app = createApp({
      baseUrl: 'http://short.test',
      clientOrigin: 'http://client.test',
      disableRateLimit: true,
    });
  });

  async function createUrl(originalUrl = 'https://example.com/articles/testing') {
    const response = await request(app).post('/api/urls').send({ url: originalUrl });
    expect(response.status).toBe(201);
    return response.body;
  }

  it.each([
    [{}, 'A URL is required.'],
    [{ url: '' }, 'A URL is required.'],
    [{ url: 'not a url' }, 'Enter a valid HTTP or HTTPS URL.'],
    [{ url: 'ftp://example.com/file' }, 'Only HTTP and HTTPS URLs are supported.'],
  ])('rejects invalid creation input %#', async (body, message) => {
    const response = await request(app).post('/api/urls').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: { code: 'INVALID_URL', message },
    });
  });

  it('creates a short URL with stable resource fields', async () => {
    const originalUrl = 'https://example.com/a/long/path?source=test';
    const response = await request(app).post('/api/urls').send({ url: originalUrl });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      shortCode: expect.any(String),
      shortUrl: expect.stringMatching(/^http:\/\/short\.test\//),
      originalUrl,
      clicks: 0,
      createdAt: expect.any(String),
    });
    expect(response.body.shortUrl).toBe(`http://short.test/${response.body.shortCode}`);
    expect(Number.isNaN(Date.parse(response.body.createdAt))).toBe(false);
  });

  it('lists created URLs', async () => {
    const created = await createUrl();

    const response = await request(app).get('/api/urls');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ urls: [created] });
  });

  it('redirects to the original URL and increments its click count', async () => {
    const created = await createUrl('https://example.com/destination');

    const redirect = await request(app).get(`/${created.shortCode}`);
    expect(redirect.status).toBe(302);
    expect(redirect.headers.location).toBe(created.originalUrl);

    const list = await request(app).get('/api/urls');
    expect(list.body.urls[0].clicks).toBe(1);
  });

  it('deletes a URL and removes it from history', async () => {
    const created = await createUrl();

    const removal = await request(app).delete(`/api/urls/${created.shortCode}`);
    expect(removal.status).toBe(204);
    expect(removal.text).toBe('');

    const list = await request(app).get('/api/urls');
    expect(list.body).toEqual({ urls: [] });
  });

  it.each([
    ['get', '/missing-code'],
    ['delete', '/api/urls/missing-code'],
  ])('returns a structured 404 for %s %s', async (method, path) => {
    const response = await request(app)[method](path);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('URL_NOT_FOUND');
  });
});

