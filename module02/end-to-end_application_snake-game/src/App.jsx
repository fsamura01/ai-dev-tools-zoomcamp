import { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import LoginModal from './components/LoginModal';
import Leaderboard from './components/Leaderboard';
import WatchingPanel from './components/WatchingPanel';
import AuthContext from './contexts/AuthContext';
import { mockApi } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [gameMode, setGameMode] = useState('pass-through'); // 'pass-through' or 'walls'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [watchingPlayers, setWatchingPlayers] = useState([]);

  // Load mock data on component mount
  useEffect(() => {
    // Load leaderboard data
    mockApi.getLeaderboard().then(data => {
      setLeaderboardData(data);
    });

    // Load watching players data
    mockApi.getWatchingPlayers().then(data => {
      setWatchingPlayers(data);
    });
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await mockApi.login(credentials);
      setCurrentUser(user);
      setShowLogin(false);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleSignup = async (userData) => {
    try {
      const user = await mockApi.signup(userData);
      setCurrentUser(user);
      setShowLogin(false);
      return user;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const toggleGameMode = () => {
    setGameMode(prevMode => prevMode === 'pass-through' ? 'walls' : 'pass-through');
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="app">
        <header className="app-header">
          <h1>Multiplayer Snake Game</h1>
          <div className="user-controls">
            {currentUser ? (
              <div className="user-info">
                <span>Welcome, {currentUser.username}!</span>
                <button onClick={handleLogout}>Logout</button>
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
            onLogin={handleLogin}
            onSignup={handleSignup}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;