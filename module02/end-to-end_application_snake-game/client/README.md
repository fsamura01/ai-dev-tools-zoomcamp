# Multiplayer Snake Game

A modern implementation of the classic Snake game with multiplayer features including leaderboards and spectator mode.

## Features

- **Two Game Modes**:
  - Pass-through: Snake can pass through walls and appear on the opposite side
  - Walls: Snake dies when hitting walls
  
- **Authentication System**:
  - User login and signup
  - Session management
  
- **Leaderboard**:
  - Top player rankings
  - Score tracking
  
- **Spectator Mode**:
  - Watch other players in real-time
  - Toggle watching status
  
- **Responsive Design**:
  - Works on desktop and mobile devices

## Architecture

The application is built with React and follows a component-based architecture:

```text
src/
├── components/          # React components
├── services/            # API service layer (mocked)
├── contexts/            # React contexts
├── hooks/               # Custom hooks
└── __tests__/           # Test files
```

### Centralized API Service

All backend interactions are centralized in [src/services/api.js](src/services/api.js), making it easy to replace the mock implementation with a real backend.

## Components

1. **GameBoard** - Main game component with snake movement logic
2. **LoginModal** - Authentication interface
3. **Leaderboard** - Player rankings display
4. **WatchingPanel** - Spectator controls and status
5. **AuthContext** - Authentication state management

## Getting Started

Due to disk space limitations, you may need to free up space to install dependencies:

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm test
```

## Game Controls

- **Arrow Keys**: Control snake direction
- **Spacebar**: Pause/resume game
- **Mouse**: Interact with UI elements

## Development

This project uses:

- React 18
- Vite for fast development
- CSS Modules for styling
- Jest and React Testing Library for testing

## Mock Backend

The application uses a mock backend implementation that simulates:

- User authentication
- Game state management
- Leaderboard updates
- Spectator functionality

To replace with a real backend, modify the [src/services/api.js](src/services/api.js) file to make actual HTTP requests.
