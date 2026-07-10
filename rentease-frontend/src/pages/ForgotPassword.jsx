import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "FORGOT" }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(text || "Failed to send OTP");
      }

      if (!response.ok)
        throw new Error(data.message || data || "Failed to send OTP");

      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
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
            Forgot Password
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email to receive a password reset verification code.
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

        <form className="space-y-5" onSubmit={handleSendOtp}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
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
            {loading ? "Sending OTP..." : "Get Reset OTP"}
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

export default ForgotPassword;
