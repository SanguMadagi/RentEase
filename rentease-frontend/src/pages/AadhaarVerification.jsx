import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

function AadhaarVerification() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const { productId, redirectTo } = location.state || {};

  const validateAadhaar = (number) => {
    const cleaned = number.replace(/\s|-/g, "");
    if (!/^\d{12}$/.test(cleaned)) return false;
    if (/^(\d)\1{11}$/.test(cleaned)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedAadhaar = aadhaarNumber.replace(/\s|-/g, "");

    if (!validateAadhaar(cleanedAadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/profile/verify-aadhaar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aadhaarNumber: cleanedAadhaar }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        throw new Error(text || "Verification failed");
      }

      if (!response.ok) throw new Error(data.message || "Verification failed");

      if (redirectTo === "payment" && productId) {
        navigate("/payment", { state: { productId } });
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message || "Failed to verify Aadhaar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) value = value.slice(0, 12);
    if (value.length > 8) value = value.slice(0, 4) + " " + value.slice(4, 8) + " " + value.slice(8);
    else if (value.length > 4) value = value.slice(0, 4) + " " + value.slice(4);
    setAadhaarNumber(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-100 flex flex-col items-center">
        
        <Link to="/" className="mb-6">
          <Logo textClassName="text-2xl font-bold ml-2 text-slate-800" />
        </Link>

        <div className="text-center mb-6 w-full">
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 shadow-sm">
            🛡️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Identity Verification
          </h2>
          <p className="text-slate-500 text-sm text-center">
            Enter your 12-digit Aadhaar card details for instant verification.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4 w-full flex justify-between items-center animate-shake">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold ml-2">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Aadhaar Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              maxLength={14}
              required
              className="w-full text-center py-3 text-xl font-bold tracking-widest border border-slate-200 rounded-xl shadow-inner placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="text-slate-400 text-[10px] text-center mt-1.5 leading-relaxed">
              🔒 Details are encrypted end-to-end. We do not store full identity keys.
            </p>
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={aadhaarNumber.replace(/\s/g, "").length !== 12}
            className="w-full"
          >
            Verify Identity
          </Button>
        </form>

        <div className="text-center mt-6 w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-slate-400 font-semibold"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] leading-relaxed text-center">
          <strong>Note:</strong> This is a secure sandbox simulation. In production, official UIDAI / Digilocker APIs are used for authorization checks.
        </div>
      </div>
    </div>
  );
}

export default AadhaarVerification;
