//import React, { useState, useEffect } from "react";
//import { Container, Card, Form, Button, Alert } from "react-bootstrap";
//import { useNavigate, Link } from "react-router-dom";
//import authService from "./authService";
//import { useAuth } from "../context/AuthContext";
//
//function Login() {
//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [otp, setOtp] = useState("");
//  const [useOtp, setUseOtp] = useState(false);
//  const [step, setStep] = useState("EMAIL"); // EMAIL -> ENTER_OTP
//  const [error, setError] = useState("");
//  const [loading, setLoading] = useState(false);
//
//  const navigate = useNavigate();
//  const { isAuthenticated, login } = useAuth();
//
//  // Redirect if already logged in
//  useEffect(() => {
//    if (isAuthenticated) navigate("/", { replace: true });
//  }, [isAuthenticated, navigate]);
//
//  const handleGoogleLogin = () => {
//    authService.loginWithGoogle();
//  };
//
//  const handleSendOtp = async (e) => {
//    e.preventDefault();
//    setError("");
//    setLoading(true);
//    try {
//      await authService.sendOtp(email, "LOGIN");
//      setStep("ENTER_OTP");
//    } catch (err) {
//      setError(err.message || "Failed to send OTP");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const handleVerifyOtp = async (e) => {
//    e.preventDefault();
//    setError("");
//    setLoading(true);
//    try {
//      const token = await authService.verifyOtp(email, otp, "LOGIN");
//      login(token); // update context + storage
//    } catch (err) {
//      setError(err.message || "OTP verification failed");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const handleLogin = async (e) => {
//    e.preventDefault();
//    setError("");
//    setLoading(true);
//    try {
//      const token = await authService.login(email, password);
//      login(token); // update context + storage
//    } catch (err) {
//      setError(err.message || "Login failed");
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
//                <h2 className="fw-bold text-primary mb-2">Login to RentEase</h2>
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
//              <Form
//                onSubmit={
//                  useOtp
//                    ? step === "EMAIL"
//                      ? handleSendOtp
//                      : handleVerifyOtp
//                    : handleLogin
//                }
//              >
//                <Form.Group className="mb-3">
//                  <Form.Label>Email</Form.Label>
//                  <Form.Control
//                    type="email"
//                    value={email}
//                    onChange={(e) => setEmail(e.target.value)}
//                    required
//                  />
//                </Form.Group>
//
//                {!useOtp && (
//                  <Form.Group className="mb-3">
//                    <Form.Label>Password</Form.Label>
//                    <Form.Control
//                      type="password"
//                      value={password}
//                      onChange={(e) => setPassword(e.target.value)}
//                      required
//                    />
//                  </Form.Group>
//                )}
//
//                {useOtp && step === "ENTER_OTP" && (
//                  <Form.Group className="mb-3">
//                    <Form.Label>Enter OTP</Form.Label>
//                    <Form.Control
//                      type="text"
//                      value={otp}
//                      onChange={(e) => setOtp(e.target.value)}
//                      required
//                    />
//                  </Form.Group>
//                )}
//
//                <Form.Group className="mb-3">
//                  <Form.Check
//                    type="checkbox"
//                    label="Login with OTP"
//                    checked={useOtp}
//                    onChange={(e) => {
//                      setUseOtp(e.target.checked);
//                      setStep("EMAIL");
//                      setOtp("");
//                    }}
//                  />
//                </Form.Group>
//
//                <Button type="submit" className="w-100 mb-3" disabled={loading}>
//                  {loading
//                    ? "Processing..."
//                    : useOtp
//                      ? step === "EMAIL"
//                        ? "Send OTP"
//                        : "Verify OTP"
//                      : "Login"}
//                </Button>
//              </Form>
//
//              <div className="text-center mb-3">
//                <Link to="/forgot-password" className="text-primary">
//                  Forgot Password?
//                </Link>
//              </div>
//
//              <div className="text-center mt-4">
//                <p className="mb-0 text-muted">
//                  Don't have an account?{" "}
//                  <Link
//                    to="/register"
//                    className="text-primary fw-semibold text-decoration-none"
//                  >
//                    Register here
//                  </Link>
//                </p>
//              </div>
//
//              <Button
//                variant="outline-primary"
//                className="w-100 mt-3"
//                onClick={handleGoogleLogin}
//              >
//                Continue with Google
//              </Button>
//            </Card.Body>
//          </Card>
//        </div>
//      </div>
//    </Container>
//  );
//}
//
//export default Login;


import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "./authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [step, setStep] = useState("EMAIL"); // EMAIL -> ENTER_OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.sendOtp(email, "LOGIN");
      setStep("ENTER_OTP");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await authService.verifyOtp(email, otp, "LOGIN");
      login(token);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await authService.login(email, password);
      login(token);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Login to RentEase
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={
              useOtp
                ? step === "EMAIL"
                  ? handleSendOtp
                  : handleVerifyOtp
                : handleLogin
            }
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {!useOtp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {useOtp && step === "ENTER_OTP" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useOtp"
                checked={useOtp}
                onChange={(e) => {
                  setUseOtp(e.target.checked);
                  setStep("EMAIL");
                  setOtp("");
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="useOtp" className="ml-2 block text-sm text-gray-700">
                Login with OTP
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-sm ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Processing..."
                : useOtp
                  ? step === "EMAIL"
                    ? "Send OTP"
                    : "Verify OTP"
                  : "Login"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-blue-600 text-sm">
              Forgot Password?
            </Link>
          </div>

          <div className="text-center mt-2">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold">
                Register here
              </Link>
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 py-2 px-4 border border-blue-600 text-blue-600 font-semibold rounded-md hover:bg-blue-50"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
