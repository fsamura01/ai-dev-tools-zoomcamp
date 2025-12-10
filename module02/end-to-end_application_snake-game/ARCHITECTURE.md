# Application Architecture

```mermaid
graph TD
    A[App Component] --> B[GameBoard Component]
    A --> C[LoginModal Component]
    A --> D[Leaderboard Component]
    A --> E[WatchingPanel Component]
    A --> F[AuthContext]
    
    B --> G[mockApi Service]
    C --> G
    D --> G
    E --> G
    
    G --> H[Mock Data Store]
    
    subgraph Frontend
        A
        B
        C
        D
        E
        F
    end
    
    subgraph Backend[Mock Backend]
        G
        H
    end
```

## Component Responsibilities

### App Component

- Main application container
- Manages global state (user auth, game mode)
- Coordinates between components

### GameBoard Component

- Renders the game grid
- Handles game logic (snake movement, collision detection)
- Manages game state (score, game over, pause)
- Communicates with mock API for game actions

### LoginModal Component

- Handles user authentication (login/signup)
- Form validation
- Communicates with mock API for auth operations

### Leaderboard Component

- Displays player rankings
- Fetches data from mock API

### WatchingPanel Component

- Shows players available for spectating
- Allows toggling watch status
- Communicates with mock API for watch actions

### AuthContext

- Provides authentication state to all components
- Enables components to access current user info

### mockApi Service

- Centralized mock backend service
- Simulates HTTP requests with delays
- Manages all data operations
- Easy to replace with real API client
