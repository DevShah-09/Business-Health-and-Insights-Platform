import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Decode the payload of a JWT (without verification — that's the server's job).
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
  const [user, setUser] = useState(null);          // { email, name }
  const [loading, setLoading] = useState(true);     // true while checking localStorage

  // Hydrate state from a stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = decodeToken(token);
      if (payload?.sub) {
        setUser({ email: payload.sub, name: payload.name || payload.sub });
      }
    }
    setLoading(false);
  }, []);

  /** Call after a successful register / login to persist the JWT */
  const login = (token) => {
    localStorage.setItem('access_token', token);
    const payload = decodeToken(token);
    setUser({ email: payload?.sub, name: payload?.name || payload?.sub });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
