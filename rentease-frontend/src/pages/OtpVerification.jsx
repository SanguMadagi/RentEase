//import React, { useState, useEffect, useMemo } from "react";
//import { Container, Card, Form, Button, Alert } from "react-bootstrap";
//import { useNavigate, useLocation } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
//
//const API_BASE_URL =
//  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//
//function OtpVerification() {
//  const location = useLocation();
//  const navigate = useNavigate();
//  const { login } = useAuth();
//
//  // ✅ Prefer location.state, fallback to sessionStorage (prevents refresh break)
//  const email = useMemo(
//    () => location.state?.email || sessionStorage.getItem("otpEmail"),
//    [location.state],
//  );
//  const purpose = useMemo(
//    () =>
//      (
//        location.state?.purpose ||
//        sessionStorage.getItem("otpPurpose") ||
//        "REGISTER"
//      ).toUpperCase(),
//    [location.state],
//  );
//  const name = useMemo(
//    () => location.state?.name || sessionStorage.getItem("otpName") || "",
//    [location.state],
//  );
//
//  const [otp, setOtp] = useState("");
//  const [error, setError] = useState("");
//  const [loading, setLoading] = useState(false);
//  const [resendLoading, setResendLoading] = useState(false);
//
//  // ✅ Redirect safely if missing email/purpose
//  useEffect(() => {
//    if (!email) {
//      navigate("/register", { replace: true });
//      return;
//    }
//    if (!purpose) {
//      navigate("/register", { replace: true });
//    }
//  }, [email, purpose, navigate]);
//
//  const handleVerify = async (e) => {
//    e.preventDefault();
//    setError("");
//
//    if (otp.length !== 6) {
//      setError("Please enter a valid 6-digit OTP");
//      return;
//    }
//
//    setLoading(true);
//    try {
//      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ email, otp, purpose }),
//      });
//
//      const data = await response.json().catch(async () => {
//        const text = await response.text();
//        throw new Error(text || "OTP verification failed");
//      });
//
//      if (!response.ok) {
//        throw new Error(data.message || "OTP verification failed");
//      }
//
//      if (!data.verified) {
//        throw new Error(data.message || "Invalid or expired OTP");
//      }
//
//      // ✅ REGISTER: backend does NOT return token here (by design)
//      if (purpose === "REGISTER") {
//        navigate("/set-password", { state: { email, name } });
//        return;
//      }
//
//      // ✅ LOGIN: token must be returned here
//      if (purpose === "LOGIN") {
//        if (!data.token) throw new Error("No token received from server");
//        login(data.token);
//        navigate("/", { replace: true });
//        return;
//      }
//
//      // fallback
//      navigate("/", { replace: true });
//    } catch (err) {
//      setError(err.message || "Invalid OTP. Please try again.");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const handleResendOtp = async () => {
//    setResendLoading(true);
//    setError("");
//    try {
//      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ email, purpose }),
//      });
//
//      const data = await response.json().catch(async () => {
//        const text = await response.text();
//        throw new Error(text || "Failed to resend OTP");
//      });
//
//      if (!response.ok) {
//        throw new Error(data.message || "Failed to resend OTP");
//      }
//
//      alert("OTP resent successfully!");
//    } catch (err) {
//      setError(err.message || "Failed to resend OTP. Please try again.");
//    } finally {
//      setResendLoading(false);
//    }
//  };
//
//  // Don’t render UI if email missing (redirect will happen)
//  if (!email) return null;
//
//  return (
//    <Container className="mt-5 mb-5">
//      <div className="row justify-content-center">
//        <div className="col-md-6 col-lg-5">
//          <Card className="shadow-lg border-0">
//            <Card.Body className="p-5">
//              <div className="text-center mb-4">
//                <h2 className="fw-bold text-primary mb-2">Verify OTP</h2>
//                <p className="text-muted mb-0">We’ve sent a 6-digit OTP to</p>
//                <p className="text-dark fw-semibold mt-1">{email}</p>
//              </div>
//
//              {error && (
//                <Alert
//                  variant="danger"
//                  dismissible
//                  onClose={() => setError("")}
//                >
//                  {error}
//                </Alert>
//              )}
//
//              <Form onSubmit={handleVerify}>
//                <Form.Group className="mb-4">
//                  <Form.Label className="fw-semibold">Enter OTP</Form.Label>
//                  <Form.Control
//                    type="text"
//                    placeholder="000000"
//                    value={otp}
//                    onChange={(e) =>
//                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                    }
//                    maxLength={6}
//                    required
//                    className="text-center py-3"
//                    style={{
//                      fontSize: "1.8rem",
//                      letterSpacing: "0.8rem",
//                      fontWeight: "bold",
//                    }}
//                  />
//                </Form.Group>
//
//                <Button
//                  variant="primary"
//                  type="submit"
//                  className="w-100 mb-3 py-2 fw-semibold"
//                  disabled={loading || otp.length !== 6}
//                  size="lg"
//                >
//                  {loading ? "Verifying..." : "Verify OTP"}
//                </Button>
//              </Form>
//
//              <div className="text-center mb-3">
//                <p className="mb-2 text-muted">Didn't receive the OTP?</p>
//                <Button
//                  variant="link"
//                  onClick={handleResendOtp}
//                  disabled={resendLoading}
//                  className="text-primary fw-semibold text-decoration-none"
//                >
//                  {resendLoading ? "Sending..." : "Resend OTP"}
//                </Button>
//              </div>
//
//              <div className="text-center mt-4">
//                <Button
//                  variant="outline-secondary"
//                  size="sm"
//                  onClick={() =>
//                    navigate(purpose === "REGISTER" ? "/register" : "/login")
//                  }
//                >
//                  ← Back
//                </Button>
//              </div>
//            </Card.Body>
//          </Card>
//        </div>
//      </div>
//    </Container>
//  );
//}
//
//export default OtpVerification;

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        navigate("/", { replace: true });
        return;
      }

      navigate("/", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Verify OTP</h2>
        <p className="text-gray-500 mb-0">We’ve sent a 6-digit OTP to</p>
        <p className="text-gray-800 font-semibold mb-6">{email}</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="mb-4">
          <div className="mb-6">
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
              className="w-full text-center py-3 text-2xl font-bold tracking-widest border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full py-3 text-white font-semibold rounded ${
              loading || otp.length !== 6
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mb-4">
          <p className="text-gray-500 mb-2">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className={`text-blue-600 font-semibold underline ${
              resendLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <button
          onClick={() =>
            navigate(purpose === "REGISTER" ? "/register" : "/login")
          }
          className="mt-4 text-gray-600 text-sm underline hover:text-gray-800"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default OtpVerification;
