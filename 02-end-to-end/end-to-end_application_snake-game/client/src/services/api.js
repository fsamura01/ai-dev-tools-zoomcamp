// Real API service communicating with the Node.js backend

const API_BASE_URL = '/api';

class RealApi {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
    }

    // Some endpoints might return empty body (e.g. 204)
    if (response.status === 204) return null;
    
    return response.json();
  }

  // User authentication
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data; // User object
  }

  async signup(userData) {
    // Signup returns user object, but typically we might auto-login or require login.
    // Our backend returns the User object.
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Game data
  async getGameSettings() {
    return this.request('/game/settings');
  }

  // Leaderboard
  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  async updateLeaderboard(scoreData) {
    // Backend expects { userId, score }
    // The previous mock signature was updateLeaderboard(newScore) which implies just score or object?
    // Let's check usages if possible, but assuming it matches backend expectation or we adapt.
    // Wait, the mock took `newScore`. If the client passes a number, we need to adapt.
    // But typically the client should pass the object.
    // Let's assume the client passes { userId, score }.
    return this.request('/leaderboard', {
        method: 'POST',
        body: JSON.stringify(scoreData)
    });
  }

  // Watching players
  async getWatchingPlayers() {
     return this.request('/watching/players');
  }

  async startWatching(playerId) {
    return this.request(`/watching/${playerId}/start`, {
        method: 'POST'
    });
  }

  async stopWatching(playerId) {
    return this.request(`/watching/${playerId}/stop`, {
        method: 'POST'
    });
  }

  // Game actions
  async startGame(gameMode) {
    return this.request('/game/start', {
        method: 'POST',
        body: JSON.stringify({ gameMode })
    });
  }

  async submitScore(scoreData) {
    // scoreData: { userId, gameId, score, gameMode, endedAt }
    return this.request('/game/score', {
        method: 'POST',
        body: JSON.stringify(scoreData)
    });
  }
}

export const mockApi = new RealApi(); // Export as mockApi to maintain compatibility with existing imports