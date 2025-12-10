// Mock API service that centralizes all backend calls
// In a real application, this would make actual HTTP requests to a backend server

class MockApi {
  // Mock user data
  users = [
    { id: 1, username: 'player1', email: 'player1@example.com', password: 'password123' },
    { id: 2, username: 'player2', email: 'player2@example.com', password: 'password123' },
    { id: 3, username: 'player3', email: 'player3@example.com', password: 'password123' }
  ];

  // Mock leaderboard data
  leaderboard = [
    { id: 1, username: 'pro_player', score: 1250, gamesPlayed: 42 },
    { id: 2, username: 'snake_master', score: 1120, gamesPlayed: 38 },
    { id: 3, username: 'beginner123', score: 890, gamesPlayed: 25 },
    { id: 4, username: 'speed_demon', score: 750, gamesPlayed: 20 },
    { id: 5, username: 'casual_gamer', score: 620, gamesPlayed: 15 }
  ];

  // Mock watching players data
  watchingPlayers = [
    { id: 1, username: 'spectator1', watching: 'pro_player', isLive: true },
    { id: 2, username: 'spectator2', watching: 'snake_master', isLive: true },
    { id: 3, username: 'spectator3', watching: 'beginner123', isLive: false },
    { id: 4, username: 'spectator4', watching: 'speed_demon', isLive: true }
  ];

  // Simulate network delay
  simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // User authentication
  async login(credentials) {
    await this.simulateDelay();
    
    const user = this.users.find(u => 
      (u.email === credentials.email || u.username === credentials.username) && 
      u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signup(userData) {
    await this.simulateDelay();
    
    // Check if user already exists
    const existingUser = this.users.find(u => 
      u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: this.users.length + 1,
      username: userData.username,
      email: userData.email,
      password: userData.password
    };
    
    this.users.push(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Game data
  async getGameSettings() {
    await this.simulateDelay();
    return {
      boardWidth: 20,
      boardHeight: 20,
      initialSpeed: 150,
      speedIncrement: 5,
      pointsPerFood: 10
    };
  }

  // Leaderboard
  async getLeaderboard() {
    await this.simulateDelay();
    return this.leaderboard;
  }

  async updateLeaderboard(newScore) {
    await this.simulateDelay();
    // In a real implementation, this would update the leaderboard
    console.log('Updating leaderboard with new score:', newScore);
    return this.leaderboard;
  }

  // Watching players
  async getWatchingPlayers() {
    await this.simulateDelay();
    return this.watchingPlayers;
  }

  async startWatching(playerId) {
    await this.simulateDelay();
    const player = this.watchingPlayers.find(p => p.id === playerId);
    if (player) {
      player.isLive = true;
      return player;
    }
    throw new Error('Player not found');
  }

  async stopWatching(playerId) {
    await this.simulateDelay();
    const player = this.watchingPlayers.find(p => p.id === playerId);
    if (player) {
      player.isLive = false;
      return player;
    }
    throw new Error('Player not found');
  }

  // Game actions
  async startGame(gameMode) {
    await this.simulateDelay();
    return {
      gameId: Math.random().toString(36).substr(2, 9),
      gameMode,
      startedAt: new Date().toISOString()
    };
  }

  async submitScore(scoreData) {
    await this.simulateDelay();
    console.log('Submitting score:', scoreData);
    return { success: true };
  }
}

// Export singleton instance
export const mockApi = new MockApi();