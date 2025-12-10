import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Validate login form
        if (!formData.email && !formData.username) {
             setError('Please provide email or username');
             return;
        }
        if (!formData.password) {
          setError('Please provide password');
          return;
        }
        
        await login({
          email: formData.email, // Backend accepts both, logic handles it
          username: formData.username,
          password: formData.password
        });
        onClose(); // Close modal on success
      } else {
        // Validate signup form
        if (!formData.username || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        const user = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        // After signup, we might need to login or we are just registered
        // Implementation in AuthContext returns user.
        // Let's assume user needs to login now from UX perspective or auto-login.
        // For simplicity, let's just close modal if we want, or switch to login?
        // Let's try to auto-login using the credentials we just used
        try {
             await login({ username: formData.username, password: formData.password });
             onClose();
        } catch(loginErr) {
             // If auto-login fails, switch to login tab and ask user to login
             setIsLogin(true);
             setError('Signup successful! Please login.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username {isLogin && '(or Email)'}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={isLogin ? "Enter username or email" : "Enter your username"}
            />
          </div>
          
          {!isLogin && (
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;