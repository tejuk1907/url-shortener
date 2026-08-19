# URL Shortener

A small full-stack application for creating, copying, tracking, and deleting short links. The React client talks to an Express REST API; the server keeps links in memory for a simple, dependency-free development data store.

## Features

- Validate and shorten HTTP or HTTPS URLs
- Copy generated short links
- View link history and click totals
- Redirect short codes and record visits
- Delete links that are no longer needed
- Return consistent JSON errors for invalid or missing resources

## Project Structure

```text
client/                 React and Vite frontend
  src/                  Components, API helpers, styles, and tests
server/                 Express backend
  src/controllers/      HTTP request and response handling
  src/routes/           API route declarations
  src/services/         Validation and URL-shortening rules
  src/repositories/     In-memory persistence
  test/                 Supertest integration tests
```

## Requirements

- Node.js 20 or newer
- npm

## Local Setup

Install all workspace dependencies from the repository root:

```bash
npm install
```

Copy the server environment example and adjust it when needed:

```bash
cp server/.env.example server/.env
```

Start the API and client together:

```bash
npm run dev
```

The API defaults to `http://localhost:3000`; Vite serves the client at `http://localhost:5173`. Set `VITE_API_URL` in `client/.env` when the API runs at a different address.

## Configuration

The server accepts these environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Express listen port |
| `BASE_URL` | `http://localhost:3000` | Prefix returned in generated short URLs |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed browser origin for CORS |

Never commit a real `.env` file. Data is currently stored in memory and is cleared whenever the server restarts.

## API

### Create a short URL

```http
POST /api/urls
Content-Type: application/json

{"url":"https://example.com/a/long/path"}
```

Returns `201` with `id`, `shortCode`, `shortUrl`, `originalUrl`, `clicks`, and `createdAt`. Invalid or unsupported URLs return `400`.

### List URL history

```http
GET /api/urls
```

Returns `200` with `{ "urls": [...] }`.

### Delete a URL

```http
DELETE /api/urls/:shortCode
```

Returns `204` when deleted or `404` when the code is unknown.

### Follow a short URL

```http
GET /:shortCode
```

Returns `302`, redirects to the original URL, and increments `clicks`. Unknown codes return `404`.

## Quality Checks

Run the combined checks from the repository root:

```bash
npm test          # Run frontend and backend tests once
npm run lint      # Check all source and tests
npm run build     # Create the production client bundle
```

For watch mode, run `npm run test:watch --workspace client` or `npm run test:watch --workspace server`.

Backend tests use Vitest and Supertest. Frontend tests use Vitest, Testing Library, and `jsdom`; they focus on behavior visible to users. Add regression coverage for every bug fix.

## Architecture and Security

Express routes delegate to controllers and a service layer, while the repository owns persistence. This keeps URL validation, code generation, and redirect behavior testable outside route declarations. Creation requests are rate-limited, JSON bodies are size-limited, Helmet adds security headers, and production deployments should set an explicit trusted `CLIENT_ORIGIN` and use HTTPS.
