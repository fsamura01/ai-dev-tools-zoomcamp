Role:
You are a full-stack software engineer and dev-ops specialist. Your job is to implement a complete end-to-end coding-interview platform (frontend + backend) that can be run locally and containerized. Produce code, tests, Dockerfile, and README.

Instructions:
1. Implement a React + Vite frontend and an Express.js backend (Node.js). Organize the repo with `client/` (frontend) and `server/` (backend) directories.
2. Implement real-time multi-user collaborative editing so everyone who connects to the same session sees live updates and can edit the shared code panel. Use WebSockets (Socket.IO).
3. Provide an API endpoint to create a new interview session and return a shareable URL (e.g., `/session/:id`).
4. Use a browser-based code editor component supporting syntax highlighting for JavaScript and Python. Editor must allow collaborative edits (propagate changes via sockets).
5. Add ability to execute code safely in the browser using WebAssembly — do not execute arbitrary user code on the server. For Python execution use a WASM-based Python runtime (e.g., Pyodide). For JS execution, run in a sandboxed iframe (or use realm-like sandboxing).
6. Provide minimal authentication-free UX: a landing page with “Create session” button, and session page with code editor, language selector, run button, and a read-only console output panel.
7. Add simple server-side session management: when a session is created, persist session state in memory (in server process) and allow joining by session id. Keep design simple and comment where a production-ready replacement (DB, auth) would go.
8. Write integration tests that simulate connecting a client to the socket server, making edits, receiving updates, and executing code in the browser environment (use Jest + Playwright or Jest + Supertest + Playwright). Also include unit tests for session creation and API.
9. Create a `README.md` with setup, run, test, and build instructions.
10. Provide a `Dockerfile` to build a single container hosting both client and server (production optimized), and provide a `docker-compose.yml` if helpful.
11. Create package.json scripts at repo root that can run client and server concurrently in development: `npm run dev`.
12. Keep code well commented and include brief documentation / TODOs for production improvements (persistent store, authentication, rate-limiting, resource caps for execution, traffic scaling).
13. Provide an `AGENTS.md` file instructing future AI agents how to run common git tasks (branching, commit, rebase, release).

Steps (deliverables):
1. `client/` React + Vite app with Monaco (or CodeMirror) editor integrated, language selector (javascript/python), run button that uses Pyodide for Python or sandboxed iframe for JS.
2. `server/` Express app with Socket.IO for real-time sync, REST endpoint `POST /api/session` to create session and `GET /api/session/:id` to fetch metadata.
3. Integration tests in `/tests` using Playwright (for end-to-end browser interaction) and Jest for server tests.
4. `README.md`, `Dockerfile`, `docker-compose.yml`, and `AGENTS.md`.
5. Root package.json with `dev` script using `concurrently` to run both client and server dev servers.

End goal:
A runnable project that you can:
- `npm install` at repo root (or install in client/server as described),
- `npm run dev` to start local development (both client and server),
- run integration tests with `npm test`,
- build Docker image and run the app in one container.

Narrowing details / constraints:
- Use Node.js 18+ compatibility.
- Keep the server minimal — memory session store is OK for the assignment, but comment where database would be used.
- Use Socket.IO (server & client) for real-time editing events and presence notifications.
- For syntax highlighting choose Monaco Editor (or CodeMirror 6) and configure JS + Python support.
- For in-browser Python execution use Pyodide (Pyodide v0.23+ recommended).
- For JS execution use a sandboxed iframe approach with message channels to avoid running code in the main window context.
- For tests prefer Playwright for E2E because it can run a headless browser and assert collaborative updates.
- Include helpful npm scripts: `client:dev`, `server:dev`, `dev`, `test`, `build`, `docker:build`, `docker:run`.

Please produce code in repository layout, include `package.json` entries, server and client source files, test files, and the requested documentation. Limit external infrastructure dependencies — prefer libraries on npm and public CDNs for Pyodide if necessary. If any security trade-offs are made for simplicity, clearly annotate them in comments and in README.
