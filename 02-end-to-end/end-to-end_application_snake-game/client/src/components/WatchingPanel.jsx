import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../services/api';
import './WatchingPanel.css';

const WatchingPanel = ({ players }) => {
  const { currentUser } = useAuth();
  // players prop is initial data, but we might want to refresh it
  const [watchingList, setWatchingList] = useState(players || []);

  useEffect(() => {
    setWatchingList(players || []);
  }, [players]);

  const handleWatchToggle = async (playerId) => {
    if (!currentUser) {
      alert("Please login to watch players.");
      return;
    }

    try {
      const updatedPlayer = watchingList.find(p => p.id === playerId);
      if (updatedPlayer) {
        if (updatedPlayer.isLive) {
          // Stop watching
          // Backend expects target player ID to stop watching? 
          // Endpoint: /watching/{playerId}/stop
          // My note in controller: "Assume playerId is target ID".
          await mockApi.stopWatching(playerId);
          updatedPlayer.isLive = false;
        } else {
          // Start watching
          await mockApi.startWatching(playerId);
          updatedPlayer.isLive = true;
        }
        // Force update UI
        setWatchingList([...watchingList]);
      }
    } catch (error) {
      console.error('Failed to toggle watching status:', error);
      alert('Action failed: ' + error.message);
    }
  };

  return (
    <div className="watching-panel">
      <h2>Watch Players</h2>
      <div className="watching-list">
        {watchingList && watchingList.length > 0 ? (
          watchingList.map((player) => (
            <div key={player.id} className="watching-item">
              <div className="player-info">
                <div className="player-name">{player.username}</div>
                <div className="player-status">
                  Watching: <span className="target-player">{player.watching}</span>
                </div>
              </div>
              <div className="watching-controls">
                <span className={`status-indicator ${player.isLive ? 'live' : 'offline'}`}>
                  {player.isLive ? 'LIVE' : 'OFFLINE'}
                </span>
                <button 
                  className={`watch-button ${player.isLive ? 'stop' : 'start'}`}
                  onClick={() => handleWatchToggle(player.id)}
                >
                  {player.isLive ? 'Stop' : 'Watch'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No active players found</div>
        )}
      </div>
      <div className="watching-note">
        <p>Note: Real-time watching requires WebSocket implementation. This is a simulation.</p>
      </div>
    </div>
  );
};

export default WatchingPanel;