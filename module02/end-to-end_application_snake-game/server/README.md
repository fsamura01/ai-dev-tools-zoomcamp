# Snake Game Backend Server

Node.js Express server for the Snake Game application, implementing the OpenAPI specification.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode
Runs the server with `nodemon` for auto-reloading on file changes.
```bash
npm run dev
```

### Production Mode
Runs the server using standard node.
```bash
npm start
```

The server will start on port **3000** by default.

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Game
- `GET /game/settings` - Retrieve game configuration
- `POST /game/start` - Start a new game session
- `POST /game/score` - Submit a final score (Requires Auth)

### Leaderboard
- `GET /leaderboard` - Get top scores
- `POST /leaderboard` - Submit score manually (Requires Auth)

### Watching
- `GET /watching/players` - List active spectators
- `POST /watching/{playerId}/start` - Start watching a player
- `POST /watching/{playerId}/stop` - Stop watching a player

## Database

This server uses a simple file-based JSON database located at `../db.json` (relative to the `src` folder, effectively in the project root or parent of `server`, or `server/../db.json`).
*Note: In the current implementation, check `src/db.js` for exact path resolution.*

## Testing

Run the smoke test script to verify all endpoints:
```bash
./smoke_test.sh
```
