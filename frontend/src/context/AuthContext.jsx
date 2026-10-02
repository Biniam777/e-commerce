import { createContext, useContext, useEffect, useState } from 'react';

import { getCurrentUser, login as loginRequest, register as registerRequest } from '../services/authService.js';
import { getToken, removeToken, setToken } from '../utils/authStorage.js';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      removeToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const register = async (credentials) => {
    const response = await registerRequest(credentials);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    register,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthProvider, useAuth };