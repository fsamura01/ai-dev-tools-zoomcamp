import { useEffect, useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import LoginModal from './components/LoginModal';
import WatchingPanel from './components/WatchingPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { mockApi } from './services/api';

function GameContent() {
  const { currentUser, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [gameMode, setGameMode] = useState('pass-through'); // 'pass-through' or 'walls'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [watchingPlayers, setWatchingPlayers] = useState([]);

  // Load data on component mount
  useEffect(() => {
    // Load leaderboard data
    mockApi.getLeaderboard().then(data => {
      setLeaderboardData(data);
    }).catch(err => console.error("Failed to load leaderboard", err));

    // Load watching players data
    mockApi.getWatchingPlayers().then(data => {
      setWatchingPlayers(data);
    }).catch(err => console.error("Failed to load watching players", err));
  }, []);

  const toggleGameMode = () => {
    setGameMode(prevMode => prevMode === 'pass-through' ? 'walls' : 'pass-through');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Multiplayer Snake Game</h1>
        <div className="user-controls">
          {currentUser ? (
            <div className="user-info">
              <span>Welcome, {currentUser.username}!</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)}>Login / Signup</button>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="game-section">
          <div className="game-controls">
            <button onClick={toggleGameMode}>
              Switch to {gameMode === 'pass-through' ? 'Walls' : 'Pass-through'} Mode
            </button>
          </div>
          <GameBoard gameMode={gameMode} />
        </div>

        <div className="side-panel">
          <Leaderboard data={leaderboardData} />
          <WatchingPanel players={watchingPlayers} />
        </div>
      </main>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameContent />
    </AuthProvider>
  );
}

export default App;