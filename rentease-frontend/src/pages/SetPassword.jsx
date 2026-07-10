import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import Logo from "../components/Logo";
import Button from "../components/Button";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email || sessionStorage.getItem("otpEmail");
  const name = state?.name || sessionStorage.getItem("otpName");

  useEffect(() => {
    if (!email || !name) {
      navigate("/register", { replace: true });
    }
  }, [email, name, navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.setPassword(email, name, password);
      authService.setToken(res.token);

      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpName");
      sessionStorage.removeItem("otpPurpose");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-100 flex flex-col items-center">
        <Link to="/" className="mb-6">
          <Logo textClassName="text-2xl font-bold ml-2 text-slate-800" />
        </Link>

        <div className="text-center mb-6 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Set Your Password</h2>
          <p className="text-slate-500 text-sm mb-1">Creating account for</p>
          <strong className="text-slate-700 text-sm break-all">{email}</strong>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4 w-full flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold ml-2">✕</button>
          </div>
        )}

        <form onSubmit={handleSetPassword} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-inner placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-inner placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="text-slate-500 text-sm font-semibold hover:underline"
          >
            ← Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
