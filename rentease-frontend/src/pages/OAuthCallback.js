import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Spinner, Alert, Card } from "react-bootstrap";
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
      navigate("/", { replace: true });
    } else {
      setError("Missing authentication token. Please try signing in again.");
    }
  }, [location.search, navigate, login]);

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: "400px" }}>
        <Card.Body className="text-center">
          {!error ? (
            <>
              <Spinner animation="border" className="mb-3" />
              <Card.Title>Signing you in with Google...</Card.Title>
              <Card.Text>Please wait while we complete your login.</Card.Text>
            </>
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Google Sign-In Failed</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OAuthCallback;
