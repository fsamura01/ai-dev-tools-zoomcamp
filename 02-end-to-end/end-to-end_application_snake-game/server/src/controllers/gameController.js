const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.getSettings = (req, res) => {
  const settings = {
    boardWidth: 20,
    boardHeight: 20,
    initialSpeed: 150,
    speedIncrement: 5,
    pointsPerFood: 10
  };
  res.json(settings);
};

exports.startGame = (req, res) => {
  const { gameMode } = req.body;
  if (!gameMode) {
    return res.status(400).json({ message: 'Game mode is required' });
  }

  const gameId = uuidv4(); // Generate unique game ID
  const startedAt = new Date().toISOString();

  // Optionally save active game state to DB if needed
  db.insert('games', {
    gameId,
    gameMode,
    startedAt,
    status: 'active'
  });

  res.json({
    gameId,
    gameMode,
    startedAt
  });
};

exports.submitScore = (req, res) => {
  const { userId, gameId, score, gameMode, endedAt } = req.body;

  if (!userId || !gameId || score === undefined || !gameMode || !endedAt) {
     return res.status(400).json({ message: 'Missing required fields' });
  }

  // Verify game exists (optional validation)
  // const game = db.findAll('games').find(g => g.gameId === gameId);
  
  const scoreEntry = {
    id: Date.now(),
    userId,
    gameId,
    score,
    gameMode,
    endedAt
  };

  db.insert('scores', scoreEntry);

  // Also check if this score qualifies for leaderboard?
  // Spec has a separate endpoint for leaderboard update, but typically we might do it here too.
  // For now, adhering to spec: just save score.

  res.json({ success: true });
};
