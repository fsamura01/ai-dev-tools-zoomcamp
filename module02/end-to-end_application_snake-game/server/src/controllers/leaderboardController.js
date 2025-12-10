const db = require('../db');

exports.getLeaderboard = (req, res) => {
  // Aggregate scores to find top players
  // In a real DB we'd query this. Here we compute from 'scores' or 'leaderboard' collection.
  // The spec has a 'leaderboard' endpoint, and also mentioned LeaderboardEntry in db.
  // We'll trust the 'scores' collection is the source of truth for raw games,
  // but for the leaderboard we might want a simplified view or just aggregate 'scores' on the fly.
  
  // Let's aggregate from 'scores' for now to be dynamic.
  // Or use the 'leaderboard' table if we want to cache it.
  // Let's use 'scores' and return top 10.
  
  const scores = db.findAll('scores');
  const users = db.findAll('users');
  
  // Sort by score desc
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  // Map to LeaderboardEntry format
  const topScores = sortedScores.slice(0, 50).map((s, index) => {
    const user = users.find(u => u.id === s.userId);
    return {
      id: index + 1, // specific leaderboard rank id
      username: user ? user.username : 'Unknown',
      score: s.score,
      gamesPlayed: scores.filter(sc => sc.userId === s.userId).length // Calculate played
    };
  });
  
  res.json(topScores);
};

exports.updateLeaderboard = (req, res) => {
  const { userId, score } = req.body;
  
  if (!userId || score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  // The spec implies this endpoint might be used to manually submit a high score
  // independently of a specific game session, or it's just a duplicate way to record.
  // We'll treat it as ensuring this score is recorded.
  
  // Check if we already have this score? No, just add it.
  const scoreEntry = {
    id: Date.now(),
    userId,
    score,
    endedAt: new Date().toISOString(),
    gameMode: 'unknown' // verification if not provided
  };

  db.insert('scores', scoreEntry);
  
  // Return updated leaderboard
  exports.getLeaderboard(req, res);
};
