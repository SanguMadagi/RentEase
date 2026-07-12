import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import Logo from "../components/Logo";
import Button from "../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [step, setStep] = useState("EMAIL"); // EMAIL -> ENTER_OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
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
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        {/* Left Panel: SaaS Welcome (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 text-white flex-col justify-between">
          <div>
            <Logo className="h-8 w-8 text-white" textClassName="text-2xl font-bold ml-2 text-white" isLight={true} />
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
          <div className="md:hidden mb-6 flex justify-center">
            <Logo className="h-8 w-8 text-blue-600" textClassName="text-2xl font-bold ml-2 text-slate-800" />
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm">
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
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            loading={googleLoading}
            className="w-full flex items-center justify-center mb-6"
          >
            {!googleLoading && <img src="/google-logo.png" alt="Google" className="h-5 w-5" />}
            {googleLoading ? "Loading..." : "Sign in with Google"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                placeholder="you@example.com"
              />
            </div>

            {!useOtp && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {useOtp && step === "ENTER_OTP" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center tracking-widest transition"
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
                className="ml-2 block text-xs font-medium text-slate-600 select-none cursor-pointer"
              >
                Sign in with OTP code
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full"
            >
              {loading
                ? useOtp
                  ? step === "EMAIL"
                    ? "Sending OTP..."
                    : "Verifying..."
                  : "Signing in..."
                : useOtp
                ? step === "EMAIL"
                  ? "Send OTP Code"
                  : "Verify & Sign In"
                : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
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
