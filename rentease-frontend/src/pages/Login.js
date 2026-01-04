import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
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

  // Redirect if already logged in
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
      login(token); // update context + storage
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
      login(token); // update context + storage
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Login to RentEase</h2>
              </div>

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Form
                onSubmit={
                  useOtp
                    ? step === "EMAIL"
                      ? handleSendOtp
                      : handleVerifyOtp
                    : handleLogin
                }
              >
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                {!useOtp && (
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                {useOtp && step === "ENTER_OTP" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Login with OTP"
                    checked={useOtp}
                    onChange={(e) => {
                      setUseOtp(e.target.checked);
                      setStep("EMAIL");
                      setOtp("");
                    }}
                  />
                </Form.Group>

                <Button type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : useOtp
                      ? step === "EMAIL"
                        ? "Send OTP"
                        : "Verify OTP"
                      : "Login"}
                </Button>
              </Form>

              <div className="text-center mb-3">
                <Link to="/forgot-password" className="text-primary">
                  Forgot Password?
                </Link>
              </div>

              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary fw-semibold text-decoration-none"
                  >
                    Register here
                  </Link>
                </p>
              </div>

              <Button
                variant="outline-primary"
                className="w-100 mt-3"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Login;
