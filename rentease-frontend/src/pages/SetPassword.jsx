// src/pages/SetPassword.jsx
import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "./authService";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email || sessionStorage.getItem("otpEmail");
  const name = state?.name || sessionStorage.getItem("otpName");

  useEffect(() => {
    if (!email || !name) {
      navigate("/register", { replace: true });
    }
  }, [email, name, navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.setPassword(email, name, password);
      authService.setToken(res.token);

      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpName");
      sessionStorage.removeItem("otpPurpose");

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <Container className="mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">

              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Set Your Password</h2>
                <p className="text-muted mb-1">Creating account for</p>
                <p className="fw-semibold">{email}</p>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSetPassword}>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

              </Form>

              <div className="text-center mt-4">
                <Button
                  variant="link"
                  className="text-decoration-none"
                  onClick={() => navigate("/register")}
                >
                  ← Back to Register
                </Button>
              </div>

            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default SetPassword;
