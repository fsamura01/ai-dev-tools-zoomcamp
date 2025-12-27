import { createContext, useContext, useEffect, useState } from 'react';
import { mockApi as api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token/user on mount
    // In a real app we might validate the token with an endpoint like /auth/me
    // Here we'll just check if we have a token (persisted in api service)
    // Since we don't have a /me endpoint in spec, we might need to rely on stored user info or just login again.
    // For now, let's assume if token exists we are logged in, but we don't have user info unless we stored it.
    // Let's modify login to store user info in localStorage as well for persistence.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const user = await api.login(credentials);
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const signup = async (userData) => {
    // Signup returns user object
    const user = await api.signup(userData);
    // Auto-login after signup?
    // If backend returns a token on signup, great. But spec only returns User object.
    // So we might need to login manually or just set user state if we assume auto-login (but we need token).
    // Spec doesn't mention token in signup response.
    // So user must login after signup to get token?
    // Let's try to see if signup can auto-login or if we just redirect to login.
    // For now, let's just return user, and let LoginModal handle flow (e.g. switch to login or auto-login if possible).
    // Actually, if we don't get a token, we can't be "logged in" for future requests.
    // So we should just return user.
    return user;
  };

  const logout = () => {
    api.setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;