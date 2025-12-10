const db = require('../db');

exports.getWatchingPlayers = (req, res) => {
  const watching = db.findAll('watching');
  const users = db.findAll('users');
  
  const watchingList = watching.map(w => {
    const spectator = users.find(u => u.id === w.spectatorId);
    const target = users.find(u => u.id === w.targetId);
    
    return {
      id: w.id,
      username: spectator ? spectator.username : 'Unknown',
      watching: target ? target.username : 'Unknown',
      isLive: true // Mock logic
    };
  });
  
  res.json(watchingList);
};

exports.startWatching = (req, res) => {
  const { playerId } = req.params; // ID of the player to watch (target)
  // In a real app, we'd know who the requester is via (req.user.id) from auth middleware
  // For this mock/simple implementation, we can assume the requester is passed or just anonymous?
  // Spec parameters: playerId (in path). Authenticated?
  // Spec doesn't strictly say it requires auth in the security section for this path, but logically it should.
  // We'll assume auth middleware is used and req.user exists.
  
  // Wait, if I don't use auth middleware on this route, I don't know who is watching.
  // The spec doesn't show auth for /watching/{playerId}/start.
  // Ideally, I should add auth. If not, I can't really "start watching" as "me".
  // I'll add auth middleware to the route.
  
  const targetId = parseInt(playerId);
  const spectatorId = req.user ? req.user.id : null; 
  
  if (!spectatorId) {
      // Fallback if not authenticated (shouldn't happen if middleware used)
      return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if target exists
  const users = db.findAll('users');
  const target = users.find(u => u.id === targetId);
  
  if (!target) {
    return res.status(404).json({ message: 'Player not found' });
  }

  // Update DB
  // Remove existing watch for this spectator if any
  const watching = db.findAll('watching');
  const existingIndex = watching.findIndex(w => w.spectatorId === spectatorId);
  if (existingIndex !== -1) {
    db.remove('watching', watching[existingIndex].id);
  }

  const watchEntry = {
    id: Date.now(),
    spectatorId,
    targetId,
    startedAt: new Date().toISOString()
  };
  
  db.insert('watching', watchEntry);

  res.json({
    id: watchEntry.id,
    username: req.user.username,
    watching: target.username,
    isLive: true
  });
};

exports.stopWatching = (req, res) => {
  const { playerId } = req.params; // This parameter name is confusing in spec.
  // "Stop Watching a Player" /watching/{playerId}/stop
  // Does it mean stop watching player X? Or is {playerId} the spectator ID?
  // Spec desc: "Stops watching a specific player."
  // Param desc: "ID of the spectator (or player to watch depending on specific logic, assumed to be target here)"... wait, I wrote that note in the previous turn or was it in the file?
  // "playerId" ... in the spec file I read:
  // "name: playerId ... description: ID of the spectator (or player to watch depending on specific logic, assumed to be target here)" was my manual viewing interpretation? 
  // Rereading file content from view_file:
  // "name: playerId ... required: true"
  // Let's assume it means the target player ID you want to stop watching.
  
  const spectatorId = req.user ? req.user.id : null;
  if (!spectatorId) return res.status(401).json({message: 'Unauthorized'});

  const watching = db.findAll('watching');
  // Find record where I am watching this player
  const targetId = parseInt(playerId);
  const entry = watching.find(w => w.spectatorId === spectatorId && w.targetId === targetId);
  
  if (entry) {
    db.remove('watching', entry.id);
  } else {
     // Or maybe just clear any watching state for me?
     // If I'm not watching them, technically I "stopped" watching them (idempotent).
     // But spec wants 404 if "Player not found". Maybe meaning target player?
     const users = db.findAll('users');
     if (!users.find(u => u.id === targetId)) {
         return res.status(404).json({ message: 'Player not found' });
     }
  }

  // Return "WatchingPlayer" object... state after stopping.
  // "watching": ??? 
  // If stopped, maybe watching is null or we return the last state?
  // I'll return a status indicate not watching.
  
  res.json({
      id: Date.now(),
      username: req.user.username,
      watching: null, 
      isLive: false
  });
};
