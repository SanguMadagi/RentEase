import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  if (!email) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword: password,
          purpose: "FORGOT",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed");

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Password reset successful! Logging you in...");
        navigate("/dashboard");
      } else {
        alert("Password reset successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-100">
        <div className="text-center flex flex-col items-center mb-6">
          <Link to="/" className="mb-6">
            <Logo textClassName="text-2xl font-bold ml-2 text-slate-800" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Reset Password
          </h2>
          <p className="text-slate-500 text-sm text-center">
            Enter the 6-digit code sent to <strong className="text-slate-700">{email}</strong> and your new password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-inner placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center tracking-widest transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl shadow-inner placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none"
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

          <Button
            type="submit"
            loading={loading}
            disabled={otp.length !== 6 || !password}
            className="w-full"
          >
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 text-sm font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
