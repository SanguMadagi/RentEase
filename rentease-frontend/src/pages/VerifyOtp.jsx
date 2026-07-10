import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../services/authService";
import Logo from "../components/Logo";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email || sessionStorage.getItem("otpEmail");
  const name = state?.name || sessionStorage.getItem("otpName");
  const purpose =
    state?.purpose || sessionStorage.getItem("otpPurpose") || "REGISTER";

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      alert("Enter a valid OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose }),
      });
      const data = await response.json();

      if (!response.ok || !data.verified) {
        alert(data.message || "Invalid or expired OTP");
        return;
      }

      if (purpose === "REGISTER") {
        navigate("/set-password", { state: { email, name } });
        return;
      }

      if (purpose === "LOGIN") {
        if (!data.token) throw new Error("No token received from server");
        authService.setToken(data.token);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      alert(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      alert("OTP resent successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-100 flex flex-col items-center">
        
        <Link to="/" className="mb-6">
          <Logo textClassName="text-2xl font-bold ml-2 text-slate-800" />
        </Link>

        <div className="text-center mb-6 w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify OTP</h2>
          <p className="text-gray-500 text-sm mb-1">OTP sent to:</p>
          <strong className="text-slate-700 text-sm break-all">{email || "N/A"}</strong>
        </div>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          className="w-full text-center py-3 text-2xl font-bold tracking-widest border border-slate-200 rounded-xl shadow-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 transition"
        />

        <div className="flex gap-3 w-full">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200/60"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-700 text-xs font-semibold hover:underline"
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
