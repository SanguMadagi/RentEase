import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as sessionUtils from '../utils/session';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = () => {
    try {
      const token = sessionUtils.getToken();
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      // Check if session is valid
      if (sessionUtils.isSessionValid()) {
        setIsAuthenticated(true);
        return true;
      } else {
        // Session invalid - logout
        logout('Session expired. Please sign in again.');
        return false;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Login function
  const login = (token) => {
    try {
      sessionUtils.setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async (message = null) => {
    try {
      const token = sessionUtils.getToken();

      // Call backend logout endpoint if token exists
      if (token) {
        try {
          const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // Log but don't block logout
          console.error('Error calling logout endpoint:', error);
        }
      }

      // Clear local storage
      sessionUtils.clearToken();
      setIsAuthenticated(false);

      // Show logout message if provided
      if (message) {
        // Store message to show in toast/alert
        sessionStorage.setItem('logoutMessage', message);
      }

      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local storage and navigate
      sessionUtils.clearToken();
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }
  };

  // Update activity (debounced)
  let activityUpdateTimeout = null;
  const updateActivity = () => {
    // Update local storage immediately
    sessionUtils.updateLastActivity();

    // Debounce backend update (1 minute)
    if (activityUpdateTimeout) {
      clearTimeout(activityUpdateTimeout);
    }

    activityUpdateTimeout = setTimeout(async () => {
      const token = sessionUtils.getToken();
      if (token && isAuthenticated) {
        try {
          const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
          const response = await fetch(`${API_BASE_URL}/api/auth/update-activity`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              // Update token with new lastActivity
              sessionUtils.setToken(data.token);
            }
          }
        } catch (error) {
          // Log but don't block - local activity is already updated
          console.error('Error updating activity on server:', error);
        }
      }
    }, 60000); // 1 minute
  };

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  // Check session validity periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && !sessionUtils.isSessionValid()) {
        logout('You were logged out due to 2 days of inactivity. Please sign in.');
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
    updateActivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

