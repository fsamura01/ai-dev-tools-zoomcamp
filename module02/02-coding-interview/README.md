# Coding Interview Platform

A real-time collaborative coding interview platform supporting JavaScript and Python execution.

## Features
- **Real-time Collaboration**: Live code editing synchronization using Socket.IO.
- **Code Execution**: 
    - Python execution in-browser via Pyodide.
    - JavaScript execution in-browser via sandboxed Iframe.
- **Frontend**: React + Vite + Monaco Editor.
- **Backend**: Express + Socket.IO (In-memory session store).

## Getting Started

### Deployment

### Deploy to Render
The project includes a `render.yaml` Blueprint for easy deployment.

1. Push this repository to GitHub.
2. Log in to [Render](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml`, build the Docker image, and deploy your app.

> **Note**: This project uses an **in-memory session store**. Do not scale beyond 1 instance, or users on different server instances won't be able to collaborate.

### Prerequisites
- Node.js 18+
- Docker (optional)

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development servers:
   ```bash
   npm run dev
   ```
   This command uses `concurrently` to run both the client (Vite) and server (Node/Express) in a single terminal.
   Access client at `http://localhost:5173`. Server runs on `http://localhost:3000`.

### Testing
Run unit and e2e tests:
```bash
npm test            # Server unit tests
npm run test:e2e    # Playwright E2E tests
```

### Docker Build
Build and run the production container:
```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

## Architecture
- **Client**: `client/` (Vite, React, Monaco)
- **Server**: `server/` (Express, Socket.IO)
- **Shared types**: Implicitly shared via JSON payloads (for now).

## Improvements for Production
- **Persistence**: Replace `store.ts` in-memory map with Redis/Postgres.
- **Security**: Improve sandbox isolation (e.g., using Web Workers or specialized sandboxes). Rate limit execution requests.
- **Auth**: Add user authentication (OAuth/JWT).
