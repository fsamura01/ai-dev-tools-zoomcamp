# Agent Instructions

This repository behaves like a standard Node.js monorepo.

## Structure
- `client/`: React + Vite frontend.
- `server/`: Express + Socket.IO backend.
- `package.json`: Root scripts to manage workspaces.

## Common Tasks

### Development
To start the development environment (client + server):
```bash
npm install
npm run dev
```

### Testing
To run all tests:
```bash
npm test
npm run test:e2e
```
Note: E2E tests require Playwright browsers (`npx playwright install chromium`) and system dependencies.

### Database / State
Currently, state is in-memory in `server/src/store.ts`. If persistence is needed:
1. Add a database (e.g. Postgres) to `docker-compose.yml`.
2. Update `store.ts` to read/write from DB.

### Deployment
To build and run with Docker:
```bash
docker build -t coding-platform .
docker run -p 3000:3000 coding-platform
```

### Git Workflow
- Create feature branches from `main`.
- Ensure tests pass before merging.
- Commit messages should be semantic (e.g., `feat: add new language support`).
