import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = useMemo(
    () => location.state?.email || sessionStorage.getItem("otpEmail"),
    [location.state],
  );
  const purpose = useMemo(
    () =>
      (
        location.state?.purpose ||
        sessionStorage.getItem("otpPurpose") ||
        "REGISTER"
      ).toUpperCase(),
    [location.state],
  );
  const name = useMemo(
    () => location.state?.name || sessionStorage.getItem("otpName") || "",
    [location.state],
  );

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
      return;
    }
    if (!purpose) {
      navigate("/register", { replace: true });
    }
  }, [email, purpose, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose }),
      });

      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "OTP verification failed");
      });

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      if (!data.verified) {
        throw new Error(data.message || "Invalid or expired OTP");
      }

      if (purpose === "REGISTER") {
        navigate("/set-password", { state: { email, name } });
        return;
      }

      if (purpose === "LOGIN") {
        if (!data.token) throw new Error("No token received from server");
        login(data.token);
        navigate("/dashboard", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });

      const data = await response.json().catch(async () => {
        const text = await response.text();
        throw new Error(text || "Failed to resend OTP");
      });

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      alert("OTP resent successfully!");
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify OTP</h2>
          <p className="text-gray-500 text-sm mb-1">We’ve sent a 6-digit verification code to</p>
          <strong className="text-slate-700 text-sm break-all">{email}</strong>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4 w-full flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleVerify} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1 text-center">
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
              className="w-full text-center py-3 text-2xl font-bold tracking-widest border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full py-2.5 text-white font-semibold rounded-lg shadow-md transition ${
              loading || otp.length !== 6
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            } text-sm`}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="text-center mt-6 w-full">
          <p className="text-gray-500 text-sm mb-2">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className={`text-blue-600 font-semibold hover:underline text-sm ${
              resendLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendLoading ? "Resending..." : "Resend OTP Code"}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link
            to={purpose === "REGISTER" ? "/register" : "/login"}
            className="text-gray-500 text-sm font-semibold hover:underline"
          >
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
