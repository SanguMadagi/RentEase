import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

function Payment() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
        navigate("/dashboard", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-lg border border-slate-100 flex flex-col items-center">
        
        <Link to="/" className="mb-6">
          <Logo textClassName="text-2xl font-bold ml-2 text-slate-800" />
        </Link>

        <div className="text-center mb-6 w-full">
          <div className="bg-green-50 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 shadow-sm">
            💳
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Checkout Payment</h2>
          {product && (
            <p className="text-slate-500 text-sm">
              Securing rental reservation for <strong className="text-slate-800">{product.name}</strong>
            </p>
          )}
        </div>

        {product && (
          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-1">{product.name}</h5>
                <p className="text-slate-500 text-[11px]">Duration: 1-Day Rental Period</p>
              </div>
              <div className="text-right">
                <h3 className="text-blue-600 font-extrabold text-lg">₹{product.price}</h3>
                <span className="text-slate-400 text-[10px] block">Total Amount Due</span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full mb-6">
          <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Payment Method</h5>
          <div className="flex flex-col gap-3">
            <button
              className={`p-4 rounded-xl flex items-center gap-4 border text-left transition ${
                paymentMethod === "upi"
                  ? "bg-blue-50/50 border-blue-500 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <span className="text-2xl">📱</span>
              <div>
                <div className="font-bold text-slate-800 text-sm">UPI Payment Gateways</div>
                <small className="text-slate-400 text-[11px]">Pay via GooglePay, PhonePe, Paytm, or BHIM</small>
              </div>
            </button>

            <button
              className={`p-4 rounded-xl flex items-center gap-4 border text-left transition ${
                paymentMethod === "card"
                  ? "bg-blue-50/50 border-blue-500 shadow-sm"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <span className="text-2xl">💳</span>
              <div>
                <div className="font-bold text-slate-800 text-sm">Credit or Debit Cards</div>
                <small className="text-slate-400 text-[11px]">Visa, MasterCard, RuPay, or American Express</small>
              </div>
            </button>
          </div>
        </div>

        {paymentMethod === "upi" && (
          <div className="w-full border border-slate-200 rounded-xl p-4 mb-6 text-center bg-slate-50 space-y-3">
            <div className="inline-block bg-white p-4 rounded-xl border border-slate-100 shadow-inner">
              <div className="text-3xl mb-1">📱</div>
              <div className="font-bold text-slate-800 text-sm">Simulated QR Code</div>
              <div className="text-slate-400 text-[11px]">Scan from sandbox environment apps</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-xs leading-relaxed">
              <strong>Mock Transaction:</strong> Click pay to initiate mock reservation workflow.
            </div>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="w-full border border-slate-200 rounded-xl p-4 mb-6 bg-slate-50">
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-xs leading-relaxed text-center">
              <strong>Mock Credit Card check:</strong> Sandbox simulation is active. Enter details at pickup.
            </div>
          </div>
        )}

        <Button
          onClick={handlePayment}
          loading={loading}
          variant="success"
          className="w-full"
        >
          Complete Payment & Book
        </Button>

        <div className="text-center mt-6 w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-slate-400 font-semibold"
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
