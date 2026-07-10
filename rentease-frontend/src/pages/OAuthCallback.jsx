//import React, { useEffect, useState } from "react";
//import { useNavigate, useLocation } from "react-router-dom";
//import { Container, Spinner, Alert, Card } from "react-bootstrap";
//import { useAuth } from "../context/AuthContext";
//
//const OAuthCallback = () => {
//  const navigate = useNavigate();
//  const location = useLocation();
//  const { login } = useAuth();
//  const [error, setError] = useState(null);
//
//  useEffect(() => {
//    const params = new URLSearchParams(location.search);
//    const token = params.get("token");
//    const name = params.get("name");
//
//    if (token) {
//      // Login using AuthContext
//      login(token);
//      if (name) {
//        localStorage.setItem("userName", name);
//      }
//      navigate("/", { replace: true });
//    } else {
//      setError("Missing authentication token. Please try signing in again.");
//    }
//  }, [location.search, navigate, login]);
//
//  return (
//    <Container className="mt-5">
//      <Card className="mx-auto" style={{ maxWidth: "400px" }}>
//        <Card.Body className="text-center">
//          {!error ? (
//            <>
//              <Spinner animation="border" className="mb-3" />
//              <Card.Title>Signing you in with Google...</Card.Title>
//              <Card.Text>Please wait while we complete your login.</Card.Text>
//            </>
//          ) : (
//            <Alert variant="danger">
//              <Alert.Heading>Google Sign-In Failed</Alert.Heading>
//              <p>{error}</p>
//            </Alert>
//          )}
//        </Card.Body>
//      </Card>
//    </Container>
//  );
//};
//
//export default OAuthCallback;


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
      navigate("/", { replace: true });
    } else {
      setError("Missing authentication token. Please try signing in again.");
    }
  }, [location.search, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm text-center">
        {!error ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-lg font-semibold mb-2">Signing you in with Google...</h2>
            <p className="text-gray-600">Please wait while we complete your login.</p>
          </>
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold block mb-2">Google Sign-In Failed</strong>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
