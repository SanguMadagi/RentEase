import * as sessionUtils from '../utils/session';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const authService = {

  // 1) LOGIN
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    return data.token; // keep JWT as it is
  },

  // 2) SEND OTP
  sendOtp: async (email, purpose) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  },

  // 3) VERIFY OTP
  verifyOtp: async (email, otp, purpose) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, purpose }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "OTP verification failed");

    return data; // contains: { verified: true }
  },

  // 4) SET PASSWORD (final registration step)
  setPassword: async (email, name, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Password setup failed");

    return data.token; // new JWT
  },

  // GOOGLE
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google?prompt=select_account`;
  },

  setToken: (token) => sessionUtils.setToken(token),
  getToken: () => sessionUtils.getToken(),
};

export default authService;
