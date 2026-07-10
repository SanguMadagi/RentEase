import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [step, setStep] = useState("EMAIL"); // EMAIL -> ENTER_OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.sendOtp(email, "LOGIN");
      setStep("ENTER_OTP");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await authService.verifyOtp(email, otp, "LOGIN");
      login(token);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await authService.login(email, password);
      login(token);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel: SaaS Welcome (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 text-white flex-col justify-between">
          <div>
            <span className="text-2xl font-bold tracking-tight">🏠 RentEase</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight mb-4">
              Your Gateway to Smart Renting and Lending
            </h1>
            <p className="text-blue-100 text-sm">
              Discover properties and products nearby. Rent what you need, lend what you don't. Safe, quick, and neighborhood-focused.
            </p>
          </div>
          <div className="text-xs text-blue-200">
            &copy; 2026 RentEase Inc. All rights reserved.
          </div>
        </div>

        {/* Right Panel: Auth Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Please enter your details to access your account.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-6 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError("")} className="font-bold ml-2">
                ✕
              </button>
            </div>
          )}

          {/* Social Sign-In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-200 rounded-lg py-2.5 hover:bg-slate-50 transition mb-6 font-medium text-gray-700 text-sm shadow-sm"
          >
            <img src="/google-logo.png" alt="Google" className="h-5 w-5 mr-3" />
            Sign in with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">Or continue with</span>
            </div>
          </div>

          <form
            className="space-y-5"
            onSubmit={
              useOtp
                ? step === "EMAIL"
                  ? handleSendOtp
                  : handleVerifyOtp
                : handleLogin
            }
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                placeholder="you@example.com"
              />
            </div>

            {!useOtp && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  placeholder="••••••••"
                />
              </div>
            )}

            {useOtp && step === "ENTER_OTP" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center tracking-widest transition"
                  placeholder="000000"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useOtp"
                checked={useOtp}
                onChange={(e) => {
                  setUseOtp(e.target.checked);
                  setStep("EMAIL");
                  setOtp("");
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="useOtp"
                className="ml-2 block text-xs font-medium text-gray-600 select-none"
              >
                Sign in with OTP code
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white font-semibold rounded-lg shadow-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } text-sm`}
            >
              {loading
                ? "Processing..."
                : useOtp
                  ? step === "EMAIL"
                    ? "Send OTP Code"
                    : "Verify & Sign In"
                  : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
