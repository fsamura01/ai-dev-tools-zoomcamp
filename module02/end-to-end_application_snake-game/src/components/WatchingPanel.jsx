import { useState } from 'react';
import './WatchingPanel.css';
import { mockApi } from '../services/api';

const WatchingPanel = ({ players }) => {
  const [watchingList, setWatchingList] = useState(players || []);

  const handleWatchToggle = async (playerId) => {
    try {
      const updatedPlayer = watchingList.find(p => p.id === playerId);
      if (updatedPlayer) {
        if (updatedPlayer.isLive) {
          // Stop watching
          await mockApi.stopWatching(playerId);
          updatedPlayer.isLive = false;
        } else {
          // Start watching
          await mockApi.startWatching(playerId);
          updatedPlayer.isLive = true;
        }
        setWatchingList([...watchingList]);
      }
    } catch (error) {
      console.error('Failed to toggle watching status:', error);
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
          <div className="no-data">No players to watch</div>
        )}
      </div>
      <div className="watching-note">
        <p>Note: In this demo, other players are simulated. In a real application, you would watch actual live games.</p>
      </div>
    </div>
  );
};

export default WatchingPanel;