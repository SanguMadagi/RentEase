import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import Button from "../components/Button";

// Category definitions
const CATEGORIES = [
  "All",
  "Cameras",
  "Wearables",
  "Electronics",
  "Sports",
  "Camping",
  "Furniture",
  "Home Appliances"
];

// Client-side category matching helper
const matchCategory = (product, category) => {
  if (category === "All") return true;
  
  if (product.category) {
    return product.category.toLowerCase() === category.toLowerCase();
  }

  const keywords = {
    "Cameras": ["camera", "dslr", "lens", "sony", "canon", "nikon", "alpha", "tripod", "mic", "gopro", "electronic", "lens", "flash"],
    "Wearables": ["watch", "wearable", "smartwatch", "titan", "rolex", "fitbit"],
    "Electronics": ["laptop", "computer", "mobile", "phone", "headphones", "speaker", "projector", "earbuds", "tv", "television", "monitor", "keyboard", "mouse", "console"],
    "Sports": ["bicycle", "football", "bike", "sport", "soccer", "cricket", "racket", "tennis", "helmet"],
    "Camping": ["tent", "camping", "backpack", "sleeping bag", "outdoor"],
    "Furniture": ["chair", "table", "furniture", "desk", "sofa", "couch"],
    "Home Appliances": ["mixer", "appliance", "blender", "oven", "microwave", "fridge", "refrigerator", "vacuum"]
  };

  const words = keywords[category] || [];
  const name = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();

  return words.some(w => name.includes(w) || desc.includes(w));
};

const ProductList = () => {
  const {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    scrollPosition,
    setScrollPosition,
    userLocation,
    setUserLocation,
    lastFetched,
    fetchProducts,
  } = useProducts();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [locationReady, setLocationReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  // Geolocation detection
  useEffect(() => {
    if (userLocation.lat && userLocation.lon) {
      setLocationReady(true);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationReady(true);
        },
        () => {
          setLocationReady(true);
        }
      );
    } else {
      setLocationReady(true);
    }
  }, [userLocation.lat, userLocation.lon, setUserLocation]);

  // Handle data fetching/refreshing
  useEffect(() => {
    if (locationReady) {
      const now = Date.now();
      if (products.length === 0) {
        fetchProducts(userLocation.lat, userLocation.lon, false);
      } else if (!lastFetched || now - lastFetched > 30000) {
        // Silent background refresh
        fetchProducts(userLocation.lat, userLocation.lon, true);
      }
    }
  }, [locationReady, userLocation.lat, userLocation.lon, products.length, lastFetched, fetchProducts]);

  // Track and save scroll position continuously
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollPosition(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollPosition]);

  // Restore scroll position
  useEffect(() => {
    if (scrollPosition > 0 && products.length > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [products, scrollPosition]);

  // Sync local query state if context query updates
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchTrigger = () => {
    setSearchQuery(localQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchTrigger();
    }
  };

  // Filter and sort products client-side for absolute instant responses
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Profile page filtering (only items listed by current user)
    if (isProfilePage) {
      const currentUserId = localStorage.getItem("userId");
      list = list.filter((p) => p.lenderId === currentUserId);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter((p) => matchCategory(p, selectedCategory));
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [products, searchQuery, selectedCategory, sortBy, isProfilePage]);

  const getDistance = (product) => {
    if (userLocation.lat && userLocation.lon && product.latitude && product.longitude) {
      // Backend getAllProducts already returns products with calculated distances if available,
      // or we can estimate/fallback to coordinate labels.
      return product.locationName || "Nearby Listing";
    }
    return product.locationName || "Location not available";
  };

  const handleEdit = (id) => navigate(`/add-product/${id}`);

  // Card Skeleton Loader Component for premium loading UX
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between"
      >
        <div className="w-full aspect-[4/3] bg-slate-100 animate-pulse"></div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-3 w-1/3 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="h-5 w-3/4 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="h-3.5 w-5/6 bg-slate-100 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 animate-pulse">
            <div className="h-5 w-1/4 bg-slate-100 rounded-full"></div>
            <div className="h-9 w-1/3 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </div>
    ));
  };

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

      {/* Categories Horizontal Carousel Filter */}
      <div className="mb-6 overflow-x-auto scrollbar-none flex gap-2 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-full border transition shrink-0 select-none ${
              selectedCategory === cat
                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modern Search & Filters Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by product name, details or keywords..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {/* Sort Dropdown Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="default">Distance: Nearest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>

            <Button
              onClick={handleSearchTrigger}
              loading={loading}
              variant="primary"
              className="h-11 px-6"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
            {localQuery && (
              <Button
                onClick={() => {
                  setLocalQuery("");
                  setSearchQuery("");
                }}
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

      {/* Products Grid / Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          renderSkeletons()
        ) : filteredProducts.length === 0 && !error ? (
          <div className="col-span-full bg-blue-50/50 border border-blue-100 text-blue-700 text-center py-12 rounded-2xl flex flex-col items-center p-8">
            <svg
              className="w-16 h-16 text-blue-500 mb-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="font-bold text-lg text-slate-800">No products available nearby</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              Try resetting your search query or list a new product in your community.
            </p>
          </div>
        ) : (
          filteredProducts.map((p) => {
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
          })
        )}
      </div>
    </div>
  );
};

export default ProductList;
