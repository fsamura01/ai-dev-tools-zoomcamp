import { mockApi } from "../services/api";

describe("Mock API Service", () => {
  beforeEach(() => {
    // Reset the mock data before each test
    mockApi.users = [
      {
        id: 1,
        username: "player1",
        email: "player1@example.com",
        password: "password123",
      },
      {
        id: 2,
        username: "player2",
        email: "player2@example.com",
        password: "password123",
      },
    ];

    mockApi.leaderboard = [
      { id: 1, username: "pro_player", score: 1250, gamesPlayed: 42 },
      { id: 2, username: "snake_master", score: 1120, gamesPlayed: 38 },
    ];

    mockApi.watchingPlayers = [
      { id: 1, username: "spectator1", watching: "pro_player", isLive: true },
      {
        id: 2,
        username: "spectator2",
        watching: "snake_master",
        isLive: false,
      },
    ];
  });

  describe("User Authentication", () => {
    test("should login user with valid credentials", async () => {
      const credentials = {
        email: "player1@example.com",
        password: "password123",
      };
      const user = await mockApi.login(credentials);

      expect(user).toEqual({
        id: 1,
        username: "player1",
        email: "player1@example.com",
      });
      expect(user).not.toHaveProperty("password");
    });

    test("should fail login with invalid credentials", async () => {
      const credentials = {
        email: "player1@example.com",
        password: "wrongpassword",
      };

      await expect(mockApi.login(credentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    test("should signup new user", async () => {
      const userData = {
        username: "newplayer",
        email: "newplayer@example.com",
        password: "newpassword123",
      };

      const user = await mockApi.signup(userData);

      expect(user).toEqual({
        id: 3,
        username: "newplayer",
        email: "newplayer@example.com",
      });
      expect(user).not.toHaveProperty("password");

      // Verify user was added to users array
      expect(mockApi.users).toHaveLength(3);
      expect(mockApi.users[2]).toEqual({
        id: 3,
        username: "newplayer",
        email: "newplayer@example.com",
        password: "newpassword123",
      });
    });

    test("should fail signup with existing email", async () => {
      const userData = {
        username: "newplayer",
        email: "player1@example.com",
        password: "newpassword123",
      };

      await expect(mockApi.signup(userData)).rejects.toThrow(
        "User already exists"
      );
    });
  });

  describe("Game Data", () => {
    test("should return game settings", async () => {
      const settings = await mockApi.getGameSettings();

      expect(settings).toEqual({
        boardWidth: 20,
        boardHeight: 20,
        initialSpeed: 150,
        speedIncrement: 5,
        pointsPerFood: 10,
      });
    });
  });

  describe("Leaderboard", () => {
    test("should return leaderboard data", async () => {
      const leaderboard = await mockApi.getLeaderboard();

      expect(leaderboard).toEqual([
        { id: 1, username: "pro_player", score: 1250, gamesPlayed: 42 },
        { id: 2, username: "snake_master", score: 1120, gamesPlayed: 38 },
      ]);
    });

    test("should update leaderboard", async () => {
      const newScore = { userId: 1, score: 1500 };
      const leaderboard = await mockApi.updateLeaderboard(newScore);

      // In mock implementation, it just returns the current leaderboard
      expect(leaderboard).toEqual([
        { id: 1, username: "pro_player", score: 1250, gamesPlayed: 42 },
        { id: 2, username: "snake_master", score: 1120, gamesPlayed: 38 },
      ]);
    });
  });

  describe("Watching Players", () => {
    test("should return watching players data", async () => {
      const players = await mockApi.getWatchingPlayers();

      expect(players).toEqual([
        { id: 1, username: "spectator1", watching: "pro_player", isLive: true },
        {
          id: 2,
          username: "spectator2",
          watching: "snake_master",
          isLive: false,
        },
      ]);
    });

    test("should start watching a player", async () => {
      const player = await mockApi.startWatching(2);

      expect(player).toEqual({
        id: 2,
        username: "spectator2",
        watching: "snake_master",
        isLive: true,
      });
    });

    test("should stop watching a player", async () => {
      const player = await mockApi.stopWatching(1);

      expect(player).toEqual({
        id: 1,
        username: "spectator1",
        watching: "pro_player",
        isLive: false,
      });
    });

    test("should fail to start watching non-existent player", async () => {
      await expect(mockApi.startWatching(999)).rejects.toThrow(
        "Player not found"
      );
    });
  });

  describe("Game Actions", () => {
    test("should start a game", async () => {
      const game = await mockApi.startGame("pass-through");

      expect(game).toHaveProperty("gameId");
      expect(game).toHaveProperty("gameMode", "pass-through");
      expect(game).toHaveProperty("startedAt");
    });

    test("should submit score", async () => {
      const scoreData = {
        userId: 1,
        gameId: "test-game-id",
        score: 100,
        gameMode: "walls",
        endedAt: new Date().toISOString(),
      };

      const result = await mockApi.submitScore(scoreData);

      expect(result).toEqual({ success: true });
    });
  });
});
