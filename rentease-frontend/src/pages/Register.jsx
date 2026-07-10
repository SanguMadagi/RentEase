//import React, { useState } from "react";
//import { Container, Card, Form, Button, Alert } from "react-bootstrap";
//import { useNavigate, Link } from "react-router-dom";
//
//const API_BASE_URL =
//  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//
//function Register() {
//  const [name, setName] = useState("");
//  const [email, setEmail] = useState("");
//  const [error, setError] = useState("");
//  const [loading, setLoading] = useState(false);
//
//  const navigate = useNavigate();
//
//  const handleSendOtp = async (e) => {
//    e.preventDefault();
//    setError("");
//    setLoading(true);
//
//    try {
//      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ email, purpose: "REGISTER" }),
//      });
//
//      const data = await response.json();
//
//      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
//
//      // ✅ Save in sessionStorage so refresh doesn't break flow
//      sessionStorage.setItem("otpEmail", email);
//      sessionStorage.setItem("otpName", name);
//      sessionStorage.setItem("otpPurpose", "REGISTER");
//
//      navigate("/verify-otp", { state: { email, name, purpose: "REGISTER" } });
//    } catch (err) {
//      setError(err.message || "Failed to send OTP");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  return (
//    <Container className="mt-5 mb-5">
//      <div className="row justify-content-center">
//        <div className="col-md-6 col-lg-5">
//          <Card className="shadow-lg border-0">
//            <Card.Body className="p-5">
//              <div className="text-center mb-4">
//                <h2 className="fw-bold text-primary mb-2">Join RentEase</h2>
//                <p className="text-muted">
//                  Start renting and lending products in your neighborhood
//                </p>
//              </div>
//
//              {error && (
//                <Alert
//                  variant="danger"
//                  onClose={() => setError("")}
//                  dismissible
//                >
//                  {error}
//                </Alert>
//              )}
//
//              <Form onSubmit={handleSendOtp}>
//                <Form.Group className="mb-3">
//                  <Form.Label className="fw-semibold">Full Name</Form.Label>
//                  <Form.Control
//                    type="text"
//                    placeholder="Enter full name"
//                    value={name}
//                    onChange={(e) => setName(e.target.value)}
//                    required
//                  />
//                </Form.Group>
//
//                <Form.Group className="mb-4">
//                  <Form.Label className="fw-semibold">Email</Form.Label>
//                  <Form.Control
//                    type="email"
//                    placeholder="Enter your email"
//                    value={email}
//                    onChange={(e) => setEmail(e.target.value)}
//                    required
//                  />
//                  <Form.Text className="text-muted">
//                    We will send a verification OTP
//                  </Form.Text>
//                </Form.Group>
//
//                <Button type="submit" className="w-100 py-2" disabled={loading}>
//                  {loading ? "Sending OTP..." : "Send OTP"}
//                </Button>
//              </Form>
//
//              <div className="text-center mt-4">
//                <p className="text-muted mb-0">
//                  Already have an account? <Link to="/login">Login</Link>
//                </p>
//              </div>
//            </Card.Body>
//          </Card>
//        </div>
//      </div>
//    </Container>
//  );
//}
//
//export default Register;


//import React, { useState } from "react";
//import { useNavigate, Link } from "react-router-dom";
//
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//
//function Register() {
//  const [name, setName] = useState("");
//  const [email, setEmail] = useState("");
//  const [error, setError] = useState("");
//  const [loading, setLoading] = useState(false);
//
//  const navigate = useNavigate();
//
//  const handleSendOtp = async (e) => {
//    e.preventDefault();
//    setError("");
//    setLoading(true);
//
//    try {
//      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ email, purpose: "REGISTER" }),
//      });
//
//      const data = await response.json();
//      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
//
//      sessionStorage.setItem("otpEmail", email);
//      sessionStorage.setItem("otpName", name);
//      sessionStorage.setItem("otpPurpose", "REGISTER");
//
//      navigate("/verify-otp", { state: { email, name, purpose: "REGISTER" } });
//    } catch (err) {
//      setError(err.message || "Failed to send OTP");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  return (
//    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
//        <div className="text-center mb-6">
//          <h2 className="text-2xl font-bold text-blue-600 mb-2">Join RentEase</h2>
//          <p className="text-gray-600 text-sm">
//            Start renting and lending products in your neighborhood
//          </p>
//        </div>
//
//        {error && (
//          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
//            {error}
//            <button onClick={() => setError("")} className="font-bold">
//              ✕
//            </button>
//          </div>
//        )}
//
//        <form onSubmit={handleSendOtp} className="space-y-4">
//          <div>
//            <label className="block text-sm font-semibold mb-1">Full Name</label>
//            <input
//              type="text"
//              placeholder="Enter full name"
//              value={name}
//              onChange={(e) => setName(e.target.value)}
//              required
//              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//            />
//          </div>
//
//          <div>
//            <label className="block text-sm font-semibold mb-1">Email</label>
//            <input
//              type="email"
//              placeholder="Enter your email"
//              value={email}
//              onChange={(e) => setEmail(e.target.value)}
//              required
//              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//            />
//            <p className="text-gray-500 text-xs mt-1">
//              We will send a verification OTP
//            </p>
//          </div>
//
//          <button
//            type="submit"
//            disabled={loading}
//            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
//          >
//            {loading && (
//              <span className="animate-spin border-t-2 border-b-2 border-white rounded-full h-4 w-4 mr-2"></span>
//            )}
//            {loading ? "Sending OTP..." : "Send OTP"}
//          </button>
//        </form>
//
//        <div className="text-center mt-4">
//          <p className="text-gray-500 text-sm">
//            Already have an account?{" "}
//            <Link to="/login" className="text-blue-600 hover:underline">
//              Login
//            </Link>
//          </p>
//        </div>
//      </div>
//    </div>
//  );
//}
//
//export default Register;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Join RentEase</h2>
          <p className="text-gray-600 text-sm">
            Start renting and lending products in your neighborhood
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
            {error}
            <button onClick={() => setError("")} className="font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Google Sign-Up */}
        <div className="mb-4">
          <button
            type="button"
            onClick={authService.loginWithGoogle}
            className="w-full flex items-center justify-center border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
          >
            <img
              src="/google-logo.png" // Replace with your Google icon path
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Sign up with Google
          </button>
        </div>

        {/* OR separator */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              We will send a verification OTP
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
          >
            {loading && (
              <span className="animate-spin border-t-2 border-b-2 border-white rounded-full h-4 w-4 mr-2"></span>
            )}
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
