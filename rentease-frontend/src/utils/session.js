/**
 * Session utility functions for token and activity management
 * Handles JWT token expiry (48 hours) and inactivity tracking
 */

const TOKEN_KEY = "token";
const TOKEN_ISSUED_AT_KEY = "tokenIssuedAt";
const LAST_ACTIVITY_KEY = "lastActivity";
const INACTIVITY_TIMEOUT = 1000 * 60 * 60 * 48; // 48 hours in milliseconds

/**
 * Get token from localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Set token and store issued timestamp
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_ISSUED_AT_KEY, Date.now().toString());
    updateLastActivity();
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

/**
 * Remove token and all session data
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_ISSUED_AT_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    localStorage.removeItem("userName");
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};

/**
 * Check if token is expired based on JWT exp claim
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true; // If we can't parse, consider it expired
  }
};

/**
 * Get last activity timestamp
 */
export const getLastActivity = () => {
  try {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    return lastActivity ? parseInt(lastActivity, 10) : null;
  } catch (error) {
    console.error("Error getting last activity:", error);
    return null;
  }
};

/**
 * Update last activity timestamp to current time
 */
export const updateLastActivity = () => {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error updating last activity:", error);
  }
};

/**
 * Check if user has been inactive for more than 48 hours
 */
export const isInactive = () => {
  const lastActivity = getLastActivity();
  if (!lastActivity) return true;

  const now = Date.now();
  const inactivityDuration = now - lastActivity;
  return inactivityDuration >= INACTIVITY_TIMEOUT;
};

/**
 * Check if session is valid (token not expired and user not inactive)
 */
export const isSessionValid = () => {
  const token = getToken();
  if (!token) return false;

  // Check token expiry
  if (isTokenExpired(token)) {
    return false;
  }

  // Check inactivity
  if (isInactive()) {
    return false;
  }

  return true;
};

/**
 * Get inactivity duration in hours
 */
export const getInactivityHours = () => {
  const lastActivity = getLastActivity();
  if (!lastActivity) return 48; // Consider inactive if no activity recorded

  const now = Date.now();
  const inactivityDuration = now - lastActivity;
  return inactivityDuration / (1000 * 60 * 60); // Convert to hours
};
//
/**
 * Session utility functions for token and activity management
 * Works with standard JWTs and OAuth2 tokens without exp claim
 * Handles inactivity (48 hours) and ensures session validity
 */

/**
 * Session utility for token and activity management
 * Handles JWT expiry and inactivity (48h)
 */
