//import React, { useState, useEffect } from "react";
//import {
//  Container,
//  Card,
//  Button,
//  Alert,
//  Row,
//  Col,
//  Spinner,
//} from "react-bootstrap";
//import { useNavigate, useLocation } from "react-router-dom";
//
//function Payment() {
//  const [loading, setLoading] = useState(false);
//  const [paymentMethod, setPaymentMethod] = useState("upi");
//  const [product, setProduct] = useState(null);
//  const navigate = useNavigate();
//  const location = useLocation();
//  const API_BASE_URL =
//    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
//
//  const { productId } = location.state || {};
//
//  useEffect(() => {
//    if (productId) {
//      fetchProduct();
//    }
//  }, [productId]);
//
//  const fetchProduct = async () => {
//    try {
//      const token = localStorage.getItem("token");
//      const response = await fetch(
//        `${API_BASE_URL}/api/products/${productId}`,
//        {
//          headers: {
//            Authorization: `Bearer ${token}`,
//          },
//        },
//      );
//      if (response.ok) {
//        const data = await response.json();
//        setProduct(data);
//      }
//    } catch (err) {
//      console.error("Failed to fetch product:", err);
//    }
//  };
//
//  const handlePayment = async () => {
//    setLoading(true);
//    try {
//      // Simulate payment processing
//      await new Promise((resolve) => setTimeout(resolve, 2000));
//
//      // Create booking
//      const token = localStorage.getItem("token");
//      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//          Authorization: `Bearer ${token}`,
//        },
//        body: JSON.stringify({
//          productId: productId,
//          startDate: new Date().toISOString(),
//          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
//        }),
//      });
//
//      if (response.ok) {
//        alert("Payment successful! Booking confirmed.");
//        navigate("/");
//      } else {
//        throw new Error("Booking failed");
//      }
//    } catch (err) {
//      alert("Payment failed. Please try again.");
//      console.error(err);
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  return (
//    <Container className="mt-5 mb-5">
//      <div className="row justify-content-center">
//        <div className="col-md-8 col-lg-6">
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
//                    className="text-success"
//                  >
//                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
//                    <line x1="1" y1="10" x2="23" y2="10" />
//                  </svg>
//                </div>
//                <h2 className="fw-bold text-primary mb-2">Complete Payment</h2>
//                {product && (
//                  <p className="text-muted mb-0">
//                    Booking: <strong>{product.name}</strong>
//                  </p>
//                )}
//              </div>
//
//              {product && (
//                <Card className="mb-4 border-primary">
//                  <Card.Body>
//                    <Row>
//                      <Col>
//                        <h5 className="mb-3">{product.name}</h5>
//                        <p className="text-muted mb-2">
//                          Price per day: ₹{product.price}
//                        </p>
//                        <p className="text-muted mb-0">Duration: 1 day</p>
//                      </Col>
//                      <Col xs="auto" className="text-end">
//                        <h3 className="text-primary mb-0">₹{product.price}</h3>
//                        <small className="text-muted">Total Amount</small>
//                      </Col>
//                    </Row>
//                  </Card.Body>
//                </Card>
//              )}
//
//              <div className="mb-4">
//                <h5 className="mb-3">Select Payment Method</h5>
//                <div className="d-grid gap-2">
//                  <Button
//                    variant={
//                      paymentMethod === "upi" ? "primary" : "outline-primary"
//                    }
//                    onClick={() => setPaymentMethod("upi")}
//                    className="py-3"
//                  >
//                    <div className="d-flex align-items-center justify-content-center">
//                      <span className="me-2">📱</span>
//                      <div className="text-start">
//                        <div className="fw-bold">UPI Payment</div>
//                        <small className="text-muted">Pay via UPI apps</small>
//                      </div>
//                    </div>
//                  </Button>
//                  <Button
//                    variant={
//                      paymentMethod === "card" ? "primary" : "outline-primary"
//                    }
//                    onClick={() => setPaymentMethod("card")}
//                    className="py-3"
//                  >
//                    <div className="d-flex align-items-center justify-content-center">
//                      <span className="me-2">💳</span>
//                      <div className="text-start">
//                        <div className="fw-bold">Card Payment</div>
//                        <small className="text-muted">Credit/Debit Card</small>
//                      </div>
//                    </div>
//                  </Button>
//                </div>
//              </div>
//
//              {paymentMethod === "upi" && (
//                <Card className="mb-4 border-success">
//                  <Card.Body className="text-center">
//                    <div className="mb-3">
//                      <div className="bg-light p-4 rounded d-inline-block">
//                        <div className="mb-2">📱</div>
//                        <div className="fw-bold mb-2">Scan QR Code</div>
//                        <div className="text-muted small">
//                          Use any UPI app to scan
//                        </div>
//                      </div>
//                    </div>
//                    <Alert variant="info" className="mb-0">
//                      <strong>Mock Payment:</strong> This is a demo. Click "Pay
//                      Now" to simulate payment.
//                    </Alert>
//                  </Card.Body>
//                </Card>
//              )}
//
//              {paymentMethod === "card" && (
//                <Card className="mb-4 border-success">
//                  <Card.Body>
//                    <Alert variant="info" className="mb-0">
//                      <strong>Mock Payment:</strong> This is a demo. Click "Pay
//                      Now" to simulate payment.
//                    </Alert>
//                  </Card.Body>
//                </Card>
//              )}
//
//              <Button
//                variant="success"
//                size="lg"
//                className="w-100 py-3 fw-bold"
//                onClick={handlePayment}
//                disabled={loading}
//              >
//                {loading ? (
//                  <>
//                    <Spinner animation="border" size="sm" className="me-2" />
//                    Processing Payment...
//                  </>
//                ) : (
//                  "💳 Pay Now"
//                )}
//              </Button>
//
//              <div className="text-center mt-3">
//                <Button
//                  variant="link"
//                  onClick={() => navigate(-1)}
//                  className="text-muted text-decoration-none"
//                >
//                  ← Cancel
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
//export default Payment;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Payment() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  const { productId } = location.state || {};

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      if (response.ok) {
        alert("Payment successful! Booking confirmed.");
        navigate("/");
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="mb-3 inline-block">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Complete Payment</h2>
          {product && (
            <p className="text-gray-500 mb-0">
              Booking: <strong className="text-gray-800">{product.name}</strong>
            </p>
          )}
        </div>

        {product && (
          <div className="border border-blue-500 rounded-lg mb-6 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="mb-2 font-semibold">{product.name}</h5>
                <p className="text-gray-500 mb-1">Price per day: ₹{product.price}</p>
                <p className="text-gray-500 mb-0">Duration: 1 day</p>
              </div>
              <div className="text-right">
                <h3 className="text-blue-600 font-bold mb-0">₹{product.price}</h3>
                <small className="text-gray-500">Total Amount</small>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h5 className="mb-3 font-semibold">Select Payment Method</h5>
          <div className="flex flex-col gap-3">
            <button
              className={`py-3 rounded-lg flex items-center justify-center gap-3 ${
                paymentMethod === "upi"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <span>📱</span>
              <div className="text-left">
                <div className="font-semibold">UPI Payment</div>
                <small className="text-gray-500">Pay via UPI apps</small>
              </div>
            </button>

            <button
              className={`py-3 rounded-lg flex items-center justify-center gap-3 ${
                paymentMethod === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <span>💳</span>
              <div className="text-left">
                <div className="font-semibold">Card Payment</div>
                <small className="text-gray-500">Credit/Debit Card</small>
              </div>
            </button>
          </div>
        </div>

        {paymentMethod === "upi" && (
          <div className="border border-green-500 rounded-lg p-4 mb-6 text-center">
            <div className="mb-3 inline-block bg-gray-100 p-4 rounded">
              <div className="mb-2 text-3xl">📱</div>
              <div className="font-semibold mb-1">Scan QR Code</div>
              <div className="text-gray-500 text-sm">Use any UPI app to scan</div>
            </div>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
              <strong>Mock Payment:</strong> This is a demo. Click "Pay Now" to simulate payment.
            </div>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="border border-green-500 rounded-lg p-4 mb-6">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
              <strong>Mock Payment:</strong> This is a demo. Click "Pay Now" to simulate payment.
            </div>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white ${
            loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            "💳 Pay Now"
          )}
        </button>

        <div className="text-center mt-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            ← Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
