# Repository Guidelines

## Project Structure & Module Organization

This repository is an early-stage URL shortener; currently, `readme.md` is the only project document. Follow the planned split when adding code:

- `client/`: React application, with components and application code in `client/src/` and static assets in `client/public/`.
- `server/`: Express API. Keep route definitions in `server/routes/`, request logic in `server/controllers/`, and persistence models in `server/models/`.
- Tests should live beside the code they cover as `*.test.js` or in a nearby `__tests__/` directory.

Keep URL generation, validation, persistence, and redirect logic in separate server modules. Avoid putting business logic directly in Express route declarations or React presentation components.

## Build, Test, and Development Commands

No package manifests are committed yet. Once `client/package.json` and `server/package.json` exist, expose consistent npm scripts in each package:

```bash
npm install       # Install dependencies in client/ or server/
npm run dev       # Start the package in development mode
npm test          # Run its automated test suite
npm run build     # Create the React production bundle
npm run lint      # Check formatting and code-quality rules
```

Run commands from the relevant package directory. Document any new required script in `readme.md`.

## Coding Style & Naming Conventions

Use modern JavaScript, two-space indentation, semicolons, and single quotes unless the configured formatter says otherwise. Prefer ESLint and Prettier, committing their configuration with the first source code. Name React components in PascalCase (`ShortUrlForm.jsx`), variables and functions in camelCase (`createShortUrl`), and constants in UPPER_SNAKE_CASE. Use lowercase route paths and descriptive resource names, such as `/api/urls`.

## Testing Guidelines

Add tests with each behavior change. Test API validation, short-code collisions, missing links, redirects, and React loading/error states. Prefer integration tests for Express endpoints and user-focused component tests. Do not merge changes with failing tests; include regression coverage with bug fixes.

## Commit & Pull Request Guidelines

The current history uses a short, imperative commit subject: `Add project README`. Continue that pattern, keeping each commit focused. Pull requests should explain what changed and why, list validation commands, link relevant issues, and include screenshots for visible UI changes. Never commit `.env`, credentials, generated builds, or dependency directories.

## Security & Configuration

Validate URLs server-side, rate-limit creation endpoints, and restrict CORS in production. Provide safe example variables in `.env.example`; keep real secrets local.
