import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
      });
      const data = await res.json();
      navigate(`/session/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <h1>Coding Interview Platform</h1>
      <p>Real-time collaborative coding environment.</p>
      <button onClick={createSession} disabled={loading} className="primary-btn">
        {loading ? 'Creating...' : 'Create New Session'}
      </button>
    </div>
  );
};
