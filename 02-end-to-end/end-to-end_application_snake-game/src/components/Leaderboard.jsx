import './Leaderboard.css';

const Leaderboard = ({ data }) => {
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <div className="leaderboard-list">
        {data && data.length > 0 ? (
          data.map((player, index) => (
            <div 
              key={player.id} 
              className={`leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`}
            >
              <div className="player-rank">
                {index + 1}
              </div>
              <div className="player-info">
                <div className="player-name">{player.username}</div>
                <div className="player-stats">
                  <span>Score: {player.score}</span>
                  <span>Games: {player.gamesPlayed}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No leaderboard data available</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;