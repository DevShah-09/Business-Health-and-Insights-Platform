import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

/**
 * Decode the payload of a JWT (without verification — verification is server-side).
 */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { email, name }
  const [loading, setLoading] = useState(true);  // true while checking localStorage

  // Hydrate on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = decodeToken(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({ email: payload.sub, name: payload.name });
      } else {
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('access_token', data.access_token);
    const payload = decodeToken(data.access_token);
    setUser({ email: payload.sub, name: payload.name });
  }, []);

  const register = useCallback(async (email, fullName, password) => {
    const data = await registerUser(email, fullName, password);
    localStorage.setItem('access_token', data.access_token);
    const payload = decodeToken(data.access_token);
    setUser({ email: payload.sub, name: payload.name });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
