import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Logo from "../components/Logo";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
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
          <p className="text-gray-500 text-sm">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center tracking-widest transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !password}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition text-sm flex justify-center items-center disabled:opacity-50"
          >
            {loading && (
              <span className="animate-spin border-t-2 border-b-2 border-white rounded-full h-4 w-4 mr-2"></span>
            )}
            {loading ? "Resetting..." : "Reset Password"}
          </button>
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
