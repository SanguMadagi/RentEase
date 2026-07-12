import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      // Login using AuthContext
      login(token);
      if (name) {
        localStorage.setItem("userName", name);
      }
      navigate("/dashboard", { replace: true });
    } else {
      setError("Missing authentication token. Please try signing in again.");
    }
  }, [location.search, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl border border-slate-100 rounded-2xl p-8 sm:p-10 w-full max-w-sm text-center flex flex-col items-center">
        {!error ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Account</h2>
            <p className="text-slate-500 text-sm">Please wait while we complete your Google Sign-In.</p>
          </>
        ) : (
          <div className="w-full space-y-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm">
              <strong className="font-bold block mb-1">Google Sign-In Failed</strong>
              <span>{error}</span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
