import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProducts, getAllProducts, calculateDistance } from "../services/api";
import Button from "../components/Button";

const ProductList = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [locationReady, setLocationReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationReady(true);
        },
        () => setLocationReady(true)
      );
    } else setLocationReady(true);
  }, []);

  useEffect(() => {
    if (locationReady) loadProducts();
  }, [locationReady]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts(userLocation.lat, userLocation.lon);
      let filtered = Array.isArray(data) ? data : [];
      if (isProfilePage) {
        const currentUserId = localStorage.getItem("userId");
        filtered = filtered.filter((p) => p.lenderId === currentUserId);
      }
      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return loadProducts();
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query, userLocation.lat, userLocation.lon);
      let filtered = data || [];
      if (isProfilePage) {
        const currentUserId = localStorage.getItem("userId");
        filtered = filtered.filter((p) => p.lenderId === currentUserId);
      }
      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setError("Search failed. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (product) => {
    if (userLocation.lat && userLocation.lon && product.latitude && product.longitude) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        product.latitude,
        product.longitude
      );
      return distance < 1
        ? `${Math.round(distance * 1000)}m away`
        : `${distance.toFixed(1)}km away`;
    }
    return product.locationName || "Location not available";
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSearch();
  const handleEdit = (id) => navigate(`/add-product/${id}`);

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 mb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProfilePage ? "My Listed Products" : "Explore Rental Products"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isProfilePage 
              ? "Manage and edit items you have listed for rent." 
              : "Discover properties, gadgets, and outdoor gears nearby."
            }
          </p>
        </div>
        <Button
          onClick={() => navigate("/add-product")}
          variant="primary"
          className="shrink-0 h-11 px-5"
        >
          + List an Item
        </Button>
      </div>

      {/* Modern Search & Filters Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by product name, details or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={handleSearch}
              loading={loading}
              variant="primary"
              className="h-11 px-6"
            >
              Search
            </Button>
            {query && (
              <Button
                onClick={() => {
                  setQuery("");
                  loadProducts();
                }}
                disabled={loading}
                variant="outline"
                className="h-11 px-4"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Central Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="font-bold ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Large Loading State */}
      {loading && products.length === 0 && (
        <div className="flex justify-center my-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && !error && (
        <div className="bg-blue-50/50 border border-blue-100 text-blue-700 text-center py-12 rounded-2xl flex flex-col items-center">
          <span className="text-4xl mb-3">📦</span>
          <h3 className="font-bold text-lg text-slate-800">No active products found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">
            Try resetting your search query or list a new product in your community.
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => {
          const prodId = p.id || p._id;
          return (
            <div
              key={prodId}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {p.images && p.images.length > 0 && (
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 cursor-pointer"
                    onClick={() =>
                      isProfilePage
                        ? handleEdit(prodId)
                        : navigate(`/product/${prodId}`)
                    }
                  />
                  <span
                    className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                      p.available ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {p.available ? "Available" : "Booked"}
                  </span>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-2">
                    <span>📍</span>
                    <span className="truncate">{getDistance(p)}</span>
                  </div>
                  <h3
                    onClick={() => !isProfilePage && navigate(`/product/${prodId}`)}
                    className="font-bold text-slate-800 text-lg mb-2 cursor-pointer group-hover:text-blue-600 transition truncate"
                  >
                    {p.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">
                    {p.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-medium">Rental Price</span>
                    <span className="text-blue-600 font-extrabold text-xl">
                      ₹{p.price} <span className="text-slate-400 text-xs font-normal">/ day</span>
                    </span>
                  </div>
                  
                  {isProfilePage ? (
                    <Button
                      onClick={() => handleEdit(prodId)}
                      variant="outline"
                      className="w-full"
                    >
                      Edit Listing
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/product/${prodId}`)}
                      variant="secondary"
                      className="w-full"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
