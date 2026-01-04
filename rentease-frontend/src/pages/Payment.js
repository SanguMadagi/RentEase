import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
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
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
          productId: productId,
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
    <Container className="mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-success"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <h2 className="fw-bold text-primary mb-2">Complete Payment</h2>
                {product && (
                  <p className="text-muted mb-0">
                    Booking: <strong>{product.name}</strong>
                  </p>
                )}
              </div>

              {product && (
                <Card className="mb-4 border-primary">
                  <Card.Body>
                    <Row>
                      <Col>
                        <h5 className="mb-3">{product.name}</h5>
                        <p className="text-muted mb-2">
                          Price per day: ₹{product.price}
                        </p>
                        <p className="text-muted mb-0">Duration: 1 day</p>
                      </Col>
                      <Col xs="auto" className="text-end">
                        <h3 className="text-primary mb-0">₹{product.price}</h3>
                        <small className="text-muted">Total Amount</small>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              <div className="mb-4">
                <h5 className="mb-3">Select Payment Method</h5>
                <div className="d-grid gap-2">
                  <Button
                    variant={
                      paymentMethod === "upi" ? "primary" : "outline-primary"
                    }
                    onClick={() => setPaymentMethod("upi")}
                    className="py-3"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">📱</span>
                      <div className="text-start">
                        <div className="fw-bold">UPI Payment</div>
                        <small className="text-muted">Pay via UPI apps</small>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={
                      paymentMethod === "card" ? "primary" : "outline-primary"
                    }
                    onClick={() => setPaymentMethod("card")}
                    className="py-3"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">💳</span>
                      <div className="text-start">
                        <div className="fw-bold">Card Payment</div>
                        <small className="text-muted">Credit/Debit Card</small>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {paymentMethod === "upi" && (
                <Card className="mb-4 border-success">
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <div className="bg-light p-4 rounded d-inline-block">
                        <div className="mb-2">📱</div>
                        <div className="fw-bold mb-2">Scan QR Code</div>
                        <div className="text-muted small">
                          Use any UPI app to scan
                        </div>
                      </div>
                    </div>
                    <Alert variant="info" className="mb-0">
                      <strong>Mock Payment:</strong> This is a demo. Click "Pay
                      Now" to simulate payment.
                    </Alert>
                  </Card.Body>
                </Card>
              )}

              {paymentMethod === "card" && (
                <Card className="mb-4 border-success">
                  <Card.Body>
                    <Alert variant="info" className="mb-0">
                      <strong>Mock Payment:</strong> This is a demo. Click "Pay
                      Now" to simulate payment.
                    </Alert>
                  </Card.Body>
                </Card>
              )}

              <Button
                variant="success"
                size="lg"
                className="w-100 py-3 fw-bold"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing Payment...
                  </>
                ) : (
                  "💳 Pay Now"
                )}
              </Button>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={() => navigate(-1)}
                  className="text-muted text-decoration-none"
                >
                  ← Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Payment;
