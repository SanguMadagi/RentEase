import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import Button from "../components/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "REGISTER" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      sessionStorage.setItem("otpEmail", email);
      sessionStorage.setItem("otpName", name);
      sessionStorage.setItem("otpPurpose", "REGISTER");

      navigate("/verify-otp", { state: { email, name, purpose: "REGISTER" } });
    } catch (err) {
      setError(err.message || "Failed to send OTP");
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
            <span className="text-2xl font-bold tracking-tight">🏠 RentEase</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight mb-4">
              Join Your Local Lending Community
            </h1>
            <p className="text-blue-100 text-sm">
              Create an account to start listing properties or renting products from trusted members in your local area. Safe, simple, and shared.
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
              Create an account
            </h2>
            <p className="text-slate-500 text-sm">
              Join RentEase and explore local listings today.
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
            onClick={authService.loginWithGoogle}
            variant="outline"
            className="w-full flex items-center justify-center mb-6"
          >
            <img src="/google-logo.png" alt="Google" className="h-5 w-5 mr-3" />
            Sign up with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                placeholder="John Doe"
              />
            </div>

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
              <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                We will send you a verification OTP to verify your email.
              </p>
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full"
            >
              Get Verification OTP
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
