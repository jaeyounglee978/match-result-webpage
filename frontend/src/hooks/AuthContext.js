import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Decode token to get user info without verifying on the client
      // For now, we'll just assume the user is logged in if a token exists.
      // A better approach would be to have an endpoint like /api/auth/me
      // to verify the token and get user data.
      const decoded = JSON.parse(atob(token.split('.')[1])); // Basic decoding
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    const decoded = JSON.parse(atob(response.data.token.split('.')[1]));
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
