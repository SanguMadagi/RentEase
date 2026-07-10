import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    locationName: "",
    latitude: "",
    longitude: "",
    address: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          locationName: data.locationName || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          address: data.address || "",
          images: data.images || [],
        });
        setImagePreviews(data.images || []);
      } catch (err) {
        setError(err.message || "Failed to load product for editing");
      }
    };

    fetchProduct();
  }, [id]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
              headers: { "User-Agent": "RentEase App" },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setFormData((prev) => ({
              ...prev,
              address: data.display_name || "",
              locationName: data.display_name.split(",")[0] || "",
            }));
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        alert("Unable to get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    const newImages = [];
    const newPreviews = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onloadend = () => {
            newPreviews.push(reader.result);
            newImages.push(reader.result);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${API_BASE_URL}/api/products/${id}`
        : `${API_BASE_URL}/api/products`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          locationName: formData.locationName || formData.address || "",
          address: formData.address,
          images: formData.images,
        }),
      });

      if (!res.ok) {
        const msg =
          (await res.json()).message ||
          (isEditMode ? "Failed to update product" : "Failed to add product");
        throw new Error(msg);
      }

      alert(`Product ${isEditMode ? "updated" : "added"} successfully!`);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
            <h3 className="text-xl font-bold tracking-tight">
              {isEditMode ? "✏️ Edit Product Listing" : "📦 List Your Product for Rent"}
            </h3>
            <p className="text-blue-100 text-xs mt-1">
              Provide detailed information to start lending your item safely in your neighborhood.
            </p>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError("")} className="font-bold text-red-500 hover:text-red-700">✕</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sony Alpha DSLR Camera"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  rows={4}
                  placeholder="Explain what the product is, its features, condition, terms of usage, and rental duration rules..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Rental Price per Day (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              {/* Location Selector Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  <span>📍</span> Coordinates & Location Details
                </div>
                
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {locationLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  )}
                  {locationLoading ? "Acquiring Coordinates..." : "Detect My Location"}
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Detected Address</label>
                    <textarea
                      rows={2}
                      placeholder="Street, City, State..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Location / Locality Name</label>
                    <input
                      type="text"
                      placeholder="e.g. HSR Layout"
                      value={formData.locationName}
                      onChange={(e) =>
                        setFormData({ ...formData, locationName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Latitude *</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData({ ...formData, latitude: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Longitude *</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({ ...formData, longitude: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image upload section */}
              <div className="space-y-3.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Images (Max 5)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-3xl mb-2">📸</span>
                  <span className="text-xs font-bold text-slate-600">Click to Upload Images</span>
                  <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, or JPEG up to 5 files</span>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((img, i) => (
                      <div key={i} className="relative aspect-square border border-slate-200/60 rounded-xl overflow-hidden shadow-sm group">
                        <img
                          src={img}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm shadow-sm transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm transition shadow-md disabled:opacity-50"
                >
                  {loading
                    ? isEditMode
                      ? "Updating Listing..."
                      : "Adding Listing..."
                    : isEditMode
                    ? "Update Listing"
                    : "Publish Listing"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
