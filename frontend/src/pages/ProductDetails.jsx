import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MapView from "../components/MapView";
import Button from "../components/Button";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [owner, setOwner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const getToken = () => localStorage.getItem("token");

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      if (data.product) {
        setProduct(data.product);
        setOwner(data.owner);
      } else {
        setProduct(data);
      }
    } catch (err) {
      setError("Failed to load product details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/product/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const handleBooking = async () => {
    if (!getToken()) {
      alert("Please login to book a product");
      navigate("/login");
      return;
    }
    if (!userProfile?.aadhaarVerified) {
      navigate("/verify-aadhaar", { state: { productId: id, redirectTo: "payment" } });
      return;
    }
    navigate("/payment", { state: { productId: id } });
  };

  const handleContactOwner = () => {
    if (owner) setShowContactModal(true);
    else alert("Owner information not available");
  };

  const handleReview = async () => {
    if (!getToken()) {
      alert("Please login to add a review");
      navigate("/login");
      return;
    }
    setReviewLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ productId: id, rating, comment }),
      });
      if (!response.ok) throw new Error("Review failed");
      setRating(5);
      setComment("");
      fetchReviews();
    } catch (err) {
      alert("Review failed. Please try again.");
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <p className="text-red-500 mb-6 font-semibold">{error || "Product not found"}</p>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="primary"
        >
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 mb-16">
      
      {/* Back Link */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-semibold transition mb-6 gap-1"
      >
        &larr; Back to Listings
      </button>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Images, Info, Map, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Image Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl border border-slate-200/50 bg-slate-100 overflow-hidden shadow-sm">
                  <img
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-[1.01] transition duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Product Basic Info Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {product.description || "No description provided for this product listing."}
            </p>
          </div>

          {/* Location details */}
          {(product.locationName || (product.latitude && product.longitude)) && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">📍 Listing Location</h3>
                  {product.locationName && <p className="text-slate-500 text-sm mt-1">{product.locationName}</p>}
                </div>
                {product.latitude && product.longitude && (
                  <Button
                    href={`https://www.google.com/maps?q=${product.latitude},${product.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    className="h-10 text-xs shrink-0"
                  >
                    🗺️ Open in Google Maps
                  </Button>
                )}
              </div>

              {/* Leaflet Map Integration */}
              {product.latitude && product.longitude && (
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm h-64 z-10 relative">
                  <MapView latitude={product.latitude} longitude={product.longitude} productName={product.name} />
                </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Reviews ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No reviews yet. Be the first to write a review!</p>
            ) : (
              <div className="space-y-4 mb-8">
                {reviews.map((r) => (
                  <div key={r.id || r._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-500 text-xs font-semibold">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-bold text-slate-800 text-sm mb-4">Add Your Review</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full max-w-[200px] px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Star" : "Stars"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Comment</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a helpful review about this item..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition placeholder-slate-400"
                  />
                </div>
                <Button
                  onClick={handleReview}
                  disabled={!comment.trim()}
                  loading={reviewLoading}
                  variant="secondary"
                  className="h-10 text-xs"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Panel & Checkout */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-6 sticky top-24">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Daily Rental Price</span>
                <span className="text-2xl font-extrabold text-blue-600">₹{product.price}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                  product.available ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {product.available ? "Available" : "Booked"}
              </span>
            </div>

            {/* Aadhaar Verification alert tag inside panel */}
            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <span>🛡️</span> Identity Check
              </div>
              <p className="text-slate-500 leading-relaxed">
                {userProfile?.aadhaarVerified 
                  ? "✓ Your Aadhaar profile is verified. You can book this item instantly."
                  : "🔒 This listing requires identity verification. You will be prompted to verify your Aadhaar on checkout."
                }
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleBooking}
                disabled={!product.available}
                variant="primary"
                className="w-full"
              >
                {!userProfile?.aadhaarVerified ? "🔒 Verify & Book" : "📅 Book Now"}
              </Button>
              <Button
                onClick={handleContactOwner}
                variant="outline"
                className="w-full"
              >
                📞 Contact Product Owner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Owner Details Modal Popup */}
      {showContactModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            {/* Subtle close cross button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm">
                📞
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Owner Contact</h3>
            </div>

            {owner ? (
              <div className="space-y-6">
                {/* Username information card row */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                  <span className="block text-[10px] tracking-wider text-slate-400 uppercase font-bold">Lender Profile</span>
                  <span className="block font-bold text-slate-800 text-base">{owner.username || "Not provided"}</span>
                </div>

                {/* Contact information rows */}
                <div className="space-y-4 pt-1">
                  {owner.phone && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">Phone Number</span>
                      <a
                        href={`tel:${owner.phone}`}
                        className="text-base text-blue-600 hover:text-blue-700 font-bold hover:underline transition flex items-center gap-1.5"
                      >
                        <span className="text-xs">📞</span> {owner.phone}
                      </a>
                    </div>
                  )}

                  {owner.email && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold">Email Address</span>
                      <a
                        href={`mailto:${owner.email}`}
                        className="text-base text-blue-600 hover:text-blue-700 font-bold hover:underline transition break-all flex items-center gap-1.5"
                      >
                        <span className="text-xs">✉️</span> {owner.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-800 text-[11px] leading-relaxed">
                  💡 You can call or email the lender directly to discuss pickup coordinates, item conditions, or scheduling details.
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic py-4 text-center">Owner information is currently not available.</p>
            )}

            <div className="mt-8">
              <Button
                onClick={() => setShowContactModal(false)}
                variant="secondary"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
