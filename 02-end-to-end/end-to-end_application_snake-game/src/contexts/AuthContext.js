import { createContext, useContext } from 'react';

const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;