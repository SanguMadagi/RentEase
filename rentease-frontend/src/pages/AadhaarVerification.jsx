//import React, { useState } from "react";
//import {
//  Container,
//  Card,
//  Form,
//  Button,
//  Alert,
//  InputGroup,
//} from "react-bootstrap";
//import { useNavigate, useLocation } from "react-router-dom";
//
//function AadhaarVerification() {
//  const [aadhaarNumber, setAadhaarNumber] = useState("");
//  const [error, setError] = useState("");
//  const [loading, setLoading] = useState(false);
//  const navigate = useNavigate();
//  const location = useLocation();
//  const API_BASE_URL =
//    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//
//  // Get redirect info from location state (if coming from booking)
//  const { productId, redirectTo } = location.state || {};
//
//  // Validate Aadhaar number (12 digits)
//  const validateAadhaar = (number) => {
//    // Remove spaces and dashes
//    const cleaned = number.replace(/\s|-/g, "");
//    // Check if it's 12 digits
//    if (!/^\d{12}$/.test(cleaned)) {
//      return false;
//    }
//    // Check for invalid patterns (all same digits, sequential, etc.)
//    if (/^(\d)\1{11}$/.test(cleaned)) {
//      return false; // All same digits
//    }
//    return true;
//  };
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    setError("");
//
//    const cleanedAadhaar = aadhaarNumber.replace(/\s|-/g, "");
//
//    if (!validateAadhaar(cleanedAadhaar)) {
//      setError("Please enter a valid 12-digit Aadhaar number");
//      return;
//    }
//
//    setLoading(true);
//    try {
//      const token = localStorage.getItem("token");
//      const response = await fetch(
//        `${API_BASE_URL}/api/profile/verify-aadhaar`,
//        {
//          method: "POST",
//          headers: {
//            Authorization: `Bearer ${token}`,
//            "Content-Type": "application/json",
//          },
//          body: JSON.stringify({ aadhaarNumber: cleanedAadhaar }),
//        },
//      );
//
//      let data;
//      try {
//        data = await response.json();
//      } catch (e) {
//        const text = await response.text();
//        throw new Error(text || "Verification failed");
//      }
//
//      if (!response.ok) {
//        throw new Error(data.message || "Aadhaar verification failed");
//      }
//
//      // Success - redirect based on context
//      if (redirectTo === "payment" && productId) {
//        navigate("/payment", { state: { productId } });
//      } else {
//        navigate("/profile");
//      }
//    } catch (err) {
//      setError(err.message || "Failed to verify Aadhaar. Please try again.");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const handleAadhaarChange = (e) => {
//    let value = e.target.value.replace(/\D/g, ""); // Only digits
//    if (value.length > 12) value = value.slice(0, 12);
//    // Format as XXXX XXXX XXXX
//    if (value.length > 8) {
//      value =
//        value.slice(0, 4) + " " + value.slice(4, 8) + " " + value.slice(8);
//    } else if (value.length > 4) {
//      value = value.slice(0, 4) + " " + value.slice(4);
//    }
//    setAadhaarNumber(value);
//  };
//
//  return (
//    <Container className="mt-5 mb-5">
//      <div className="row justify-content-center">
//        <div className="col-md-6 col-lg-5">
//          <Card className="shadow-lg border-0">
//            <Card.Body className="p-5">
//              <div className="text-center mb-4">
//                <div className="mb-3">
//                  <svg
//                    width="64"
//                    height="64"
//                    viewBox="0 0 24 24"
//                    fill="none"
//                    stroke="currentColor"
//                    strokeWidth="2"
//                    className="text-primary"
//                  >
//                    <path d="M9 12l2 2 4-4" />
//                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
//                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
//                    <path d="M12 3c0 1-1 3-3 3S6 4 6 3s1-3 3-3 3 2 3 3z" />
//                    <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3z" />
//                    <circle cx="12" cy="12" r="3" />
//                  </svg>
//                </div>
//                <h2 className="fw-bold text-primary mb-2">
//                  Aadhaar Verification
//                </h2>
//                <p className="text-muted">
//                  Enter your 12-digit Aadhaar number for verification
//                </p>
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
//              <Form onSubmit={handleSubmit}>
//                <Form.Group className="mb-4">
//                  <Form.Label className="fw-semibold">
//                    Aadhaar Number
//                  </Form.Label>
//                  <InputGroup>
//                    <InputGroup.Text>🔒</InputGroup.Text>
//                    <Form.Control
//                      type="text"
//                      placeholder="XXXX XXXX XXXX"
//                      value={aadhaarNumber}
//                      onChange={handleAadhaarChange}
//                      maxLength={14} // 12 digits + 2 spaces
//                      required
//                      className="py-2 text-center"
//                      style={{ fontSize: "1.2rem", letterSpacing: "0.2rem" }}
//                    />
//                  </InputGroup>
//                  <Form.Text className="text-muted">
//                    Your Aadhaar number is encrypted and securely stored
//                  </Form.Text>
//                </Form.Group>
//
//                <Button
//                  variant="primary"
//                  type="submit"
//                  className="w-100 mb-3 py-2 fw-semibold"
//                  disabled={
//                    loading || aadhaarNumber.replace(/\s/g, "").length !== 12
//                  }
//                  size="lg"
//                >
//                  {loading ? (
//                    <>
//                      <span
//                        className="spinner-border spinner-border-sm me-2"
//                        role="status"
//                        aria-hidden="true"
//                      ></span>
//                      Verifying...
//                    </>
//                  ) : (
//                    "✓ Verify Aadhaar"
//                  )}
//                </Button>
//              </Form>
//
//              <div className="text-center mt-4">
//                <Button
//                  variant="link"
//                  onClick={() => navigate(-1)}
//                  className="text-muted text-decoration-none"
//                >
//                  ← Go Back
//                </Button>
//              </div>
//
//              <Alert variant="info" className="mt-4 mb-0">
//                <small>
//                  <strong>Note:</strong> This is a demo application. In
//                  production, Aadhaar verification would be done through
//                  official UIDAI APIs with proper encryption and security
//                  measures.
//                </small>
//              </Alert>
//            </Card.Body>
//          </Card>
//        </div>
//      </div>
//    </Container>
//  );
//}
//
//export default AadhaarVerification;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-600 mx-auto mb-3"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
              <path d="M12 3c0 1-1 3-3 3S6 4 6 3s1-3 3-3 3 2 3 3z" />
              <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Aadhaar Verification
            </h2>
            <p className="text-gray-500">
              Enter your 12-digit Aadhaar number for verification
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Aadhaar Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-200 text-gray-600 rounded-l">
                  🔒
                </span>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  maxLength={14}
                  required
                  className="flex-1 py-2 px-3 rounded-r border border-gray-300 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Your Aadhaar number is encrypted and securely stored
              </p>
            </div>

            <button
              type="submit"
              disabled={
                loading || aadhaarNumber.replace(/\s/g, "").length !== 12
              }
              className="w-full py-2 mb-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span
                    className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verifying...
                </>
              ) : (
                "✓ Verify Aadhaar"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              ← Go Back
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded">
            <strong>Note:</strong> This is a demo application. In production,
            Aadhaar verification would be done through official UIDAI APIs
            with proper encryption and security measures.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AadhaarVerification;
