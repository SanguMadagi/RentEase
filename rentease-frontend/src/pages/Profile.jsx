import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profilePicture: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchMyProducts();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        profilePicture: data.profilePicture || "",
      });
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProducts = async () => {
    setProductsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/products/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setMyProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");

      setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!user)
    return (
      <div className="max-w-md mx-auto mt-16 text-center bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <p className="text-red-500 font-semibold">Failed to load profile details</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: User Card & Identity status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 text-center flex flex-col items-center">
          <div className="relative">
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="rounded-full border-4 border-slate-100 w-32 h-32 object-cover shadow-md"
              />
            ) : (
              <div className="rounded-full w-32 h-32 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-4xl font-extrabold border-4 border-slate-100 shadow-md">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">{user.username || "User Profile"}</h2>
            <p className="text-slate-400 text-xs">{user.email}</p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
              user.aadhaarVerified ? "bg-emerald-500" : "bg-amber-500"
            }`}
          >
            {user.aadhaarVerified ? "✓ Aadhaar Verified" : "⚠ Not Verified"}
          </span>

          {!user.aadhaarVerified && (
            <div className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-left space-y-2.5">
              <h5 className="font-bold text-amber-800 text-xs flex items-center gap-1">
                ⚠️ Verification Pending
              </h5>
              <p className="text-amber-700/80 text-[11px] leading-relaxed">
                Complete your identity check to be eligible for renting properties and high-value gear.
              </p>
              <Button
                onClick={() => navigate("/verify-aadhaar")}
                className="w-full bg-amber-600 hover:bg-amber-700 hover:text-white border-none"
              >
                Verify Aadhaar Now
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Profile Info fields & Listed Products */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Form Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              {!editMode && (
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outline"
                  className="h-10 text-xs"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex justify-between items-center">
                <span>{error}</span>
                <button className="font-bold" onClick={() => setError("")}>✕</button>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex justify-between items-center">
                <span>{success}</span>
                <button className="font-bold" onClick={() => setSuccess("")}>✕</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Profile Picture</label>
                {editMode ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.profilePicture ? "Avatar uploaded" : "No avatar image set"}
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Address</label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Enter your residence details..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>
            </div>

            {editMode && (
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <Button
                  onClick={handleSave}
                  loading={saving}
                  variant="primary"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setEditMode(false);
                    fetchProfile();
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Listed Products Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">My Listed Products</h3>
            
            {productsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : myProducts.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <span className="text-3xl block">📦</span>
                <p className="text-slate-400 text-sm italic">You have not listed any products yet.</p>
                <Link to="/add-product" className="text-blue-600 font-bold text-xs hover:underline block pt-2">
                  List your first item now &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myProducts.map((product) => {
                  const prodId = product.id || product._id;
                  return (
                    <div
                      key={prodId}
                      className="bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between group"
                    >
                      {product.images && product.images[0] && (
                        <div className="aspect-video w-full bg-slate-50 overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition truncate">{product.name}</h5>
                          <span className="text-blue-600 font-extrabold text-xs block mt-1">₹{product.price} / day</span>
                        </div>
                        <div className="flex gap-3.5 pt-3 border-t border-slate-100">
                          <Button
                            onClick={() => navigate(`/add-product/${prodId}`)}
                            variant="outline"
                            className="flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(prodId)}
                            variant="danger"
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
