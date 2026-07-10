//import React, { useState, useEffect } from "react";
//import {
//  Container,
//  Card,
//  Form,
//  Button,
//  Alert,
//  Row,
//  Col,
//  Badge,
//  Spinner,
//} from "react-bootstrap";
//import { useNavigate } from "react-router-dom";
//
//function Profile() {
//  const [user, setUser] = useState(null);
//  const [loading, setLoading] = useState(true);
//  const [saving, setSaving] = useState(false);
//  const [error, setError] = useState("");
//  const [success, setSuccess] = useState("");
//  const [editMode, setEditMode] = useState(false);
//  const [myProducts, setMyProducts] = useState([]);
//  const [productsLoading, setProductsLoading] = useState(true);
//
//  const navigate = useNavigate();
//  const API_BASE_URL =
//    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
//
//  const [formData, setFormData] = useState({
//    username: "",
//    email: "",
//    phone: "",
//    address: "",
//    city: "",
//    state: "",
//    pincode: "",
//    profilePicture: "",
//  });
//
//  useEffect(() => {
//    fetchProfile();
//    fetchMyProducts();
//  }, []);
//
//  const fetchProfile = async () => {
//    try {
//      const token = localStorage.getItem("token");
//      const response = await fetch(`${API_BASE_URL}/api/profile`, {
//        headers: {
//          Authorization: `Bearer ${token}`,
//          "Content-Type": "application/json",
//        },
//      });
//
//      if (!response.ok) throw new Error("Failed to fetch profile");
//
//      const data = await response.json();
//      setUser(data);
//      setFormData({
//        username: data.username || "",
//        email: data.email || "",
//        phone: data.phone || "",
//        address: data.address || "",
//        city: data.city || "",
//        state: data.state || "",
//        pincode: data.pincode || "",
//        profilePicture: data.profilePicture || "",
//      });
//    } catch (err) {
//      setError("Failed to load profile. Please try again.");
//      console.error(err);
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const fetchMyProducts = async () => {
//    setProductsLoading(true);
//    try {
//      const token = localStorage.getItem("token");
//      const res = await fetch(`${API_BASE_URL}/api/products/my-products`, {
//        headers: { Authorization: `Bearer ${token}` },
//      });
//      if (!res.ok) throw new Error("Failed to fetch products");
//      const data = await res.json();
//      setMyProducts(data);
//    } catch (err) {
//      console.error(err);
//    } finally {
//      setProductsLoading(false);
//    }
//  };
//
//  const handleInputChange = (e) => {
//    const { name, value } = e.target;
//    setFormData((prev) => ({ ...prev, [name]: value }));
//  };
//
//  const handleImageUpload = (e) => {
//    const file = e.target.files[0];
//    if (file) {
//      if (file.size > 2 * 1024 * 1024) {
//        setError("Image size should be less than 2MB");
//        return;
//      }
//      const reader = new FileReader();
//      reader.onloadend = () => {
//        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
//      };
//      reader.readAsDataURL(file);
//    }
//  };
//
//  const handleSave = async () => {
//    setSaving(true);
//    setError("");
//    setSuccess("");
//
//    try {
//      const token = localStorage.getItem("token");
//      const response = await fetch(`${API_BASE_URL}/api/profile`, {
//        method: "PUT",
//        headers: {
//          Authorization: `Bearer ${token}`,
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify(formData),
//      });
//
//      if (!response.ok) {
//        const errorData = await response.json();
//        throw new Error(errorData.message || "Failed to update profile");
//      }
//
//      setSuccess("Profile updated successfully!");
//      setEditMode(false);
//      fetchProfile();
//    } catch (err) {
//      setError(err.message || "Failed to update profile. Please try again.");
//    } finally {
//      setSaving(false);
//    }
//  };
//
//  const handleDeleteProduct = async (productId) => {
//    if (!window.confirm("Are you sure you want to delete this product?"))
//      return;
//
//    try {
//      const token = localStorage.getItem("token");
//      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
//        method: "DELETE",
//        headers: { Authorization: `Bearer ${token}` },
//      });
//
//      if (!res.ok) throw new Error("Failed to delete product");
//
//      setMyProducts((prev) => prev.filter((p) => p.id !== productId));
//      alert("Product deleted successfully!");
//    } catch (err) {
//      console.error(err);
//      alert("Error deleting product.");
//    }
//  };
//
//  if (loading)
//    return (
//      <Container className="mt-5 text-center">
//        <Spinner animation="border" role="status" />
//      </Container>
//    );
//
//  if (!user)
//    return (
//      <Container className="mt-5">
//        <Alert variant="danger">Failed to load profile</Alert>
//      </Container>
//    );
//
//  return (
//    <Container className="mt-4 mb-5">
//      <Row className="justify-content-center">
//        <Col md={10} lg={8}>
//          <Card className="shadow-lg border-0">
//            <Card.Body className="p-5">
//              <div className="text-center mb-4">
//                <div className="mb-3">
//                  {formData.profilePicture ? (
//                    <img
//                      src={formData.profilePicture}
//                      alt="Profile"
//                      className="rounded-circle"
//                      style={{
//                        width: "150px",
//                        height: "150px",
//                        objectFit: "cover",
//                        border: "4px solid #0d6efd",
//                      }}
//                    />
//                  ) : (
//                    <div
//                      className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                      style={{
//                        width: "150px",
//                        height: "150px",
//                        backgroundColor: "#0d6efd",
//                        color: "white",
//                        fontSize: "3rem",
//                        border: "4px solid #0d6efd",
//                      }}
//                    >
//                      {user.username
//                        ? user.username.charAt(0).toUpperCase()
//                        : "U"}
//                    </div>
//                  )}
//                </div>
//                <h2 className="fw-bold text-primary mb-2">
//                  {user.username || "User"}
//                </h2>
//                <Badge
//                  bg={user.aadhaarVerified ? "success" : "warning"}
//                  className="px-3 py-2"
//                >
//                  {user.aadhaarVerified
//                    ? "✓ Aadhaar Verified"
//                    : "⚠ Aadhaar Not Verified"}
//                </Badge>
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
//              {success && (
//                <Alert
//                  variant="success"
//                  dismissible
//                  onClose={() => setSuccess("")}
//                >
//                  {success}
//                </Alert>
//              )}
//
//              <div className="d-flex justify-content-between align-items-center mb-4">
//                <h4 className="mb-0">Profile Information</h4>
//                {!editMode && (
//                  <Button
//                    variant="outline-primary"
//                    onClick={() => setEditMode(true)}
//                  >
//                    ✏️ Edit Profile
//                  </Button>
//                )}
//              </div>
//
//              <Form>
//                <Row>
//                  <Col md={6} className="mb-3">
//                    <Form.Label className="fw-semibold">Full Name</Form.Label>
//                    <Form.Control
//                      type="text"
//                      name="username"
//                      value={formData.username}
//                      onChange={handleInputChange}
//                      disabled={!editMode}
//                      className="py-2"
//                    />
//                  </Col>
//                  <Col md={6} className="mb-3">
//                    <Form.Label className="fw-semibold">Email</Form.Label>
//                    <Form.Control
//                      type="email"
//                      name="email"
//                      value={formData.email}
//                      disabled
//                      className="py-2 bg-light"
//                    />
//                    <Form.Text className="text-muted">
//                      Email cannot be changed
//                    </Form.Text>
//                  </Col>
//                </Row>
//
//                <Row>
//                  <Col md={6} className="mb-3">
//                    <Form.Label className="fw-semibold">
//                      Phone Number
//                    </Form.Label>
//                    <Form.Control
//                      type="tel"
//                      name="phone"
//                      value={formData.phone}
//                      onChange={handleInputChange}
//                      disabled={!editMode}
//                      placeholder="+91 9876543210"
//                      className="py-2"
//                    />
//                  </Col>
//                  <Col md={6} className="mb-3">
//                    <Form.Label className="fw-semibold">
//                      Profile Picture
//                    </Form.Label>
//                    {editMode ? (
//                      <Form.Control
//                        type="file"
//                        accept="image/*"
//                        onChange={handleImageUpload}
//                        className="py-2"
//                      />
//                    ) : (
//                      <Form.Control
//                        type="text"
//                        value={
//                          formData.profilePicture
//                            ? "Image uploaded"
//                            : "No image"
//                        }
//                        disabled
//                        className="py-2 bg-light"
//                      />
//                    )}
//                  </Col>
//                </Row>
//
//                <Row>
//                  <Col md={12} className="mb-3">
//                    <Form.Label className="fw-semibold">Address</Form.Label>
//                    <Form.Control
//                      as="textarea"
//                      rows={2}
//                      name="address"
//                      value={formData.address}
//                      onChange={handleInputChange}
//                      disabled={!editMode}
//                      placeholder="Enter your address"
//                      className="py-2"
//                    />
//                  </Col>
//                </Row>
//
//                <Row>
//                  <Col md={4} className="mb-3">
//                    <Form.Label className="fw-semibold">City</Form.Label>
//                    <Form.Control
//                      type="text"
//                      name="city"
//                      value={formData.city}
//                      onChange={handleInputChange}
//                      disabled={!editMode}
//                      placeholder="City"
//                      className="py-2"
//                    />
//                  </Col>
//                  <Col md={4} className="mb-3">
//                    <Form.Label className="fw-semibold">State</Form.Label>
//                    <Form.Control
//                      type="text"
//                      name="state"
//                      value={formData.state}
//                      onChange={handleInputChange}
//                      disabled={!editMode}
//                      placeholder="State"
//                      className="py-2"
//                    />
//                  </Col>
//                  <Col md={4} className="mb-3">
//                    <Form.Label className="fw-semibold">Pincode</Form.Label>
//                    <Form.Control
//                      type="text"
//                      name="pincode"
//                      value={formData.pincode}
//                      onChange={handleInputChange}
//                      disabled={!editMode}
//                      placeholder="123456"
//                      className="py-2"
//                    />
//                  </Col>
//                </Row>
//
//                {editMode && (
//                  <div className="d-flex gap-2 mt-4">
//                    <Button
//                      variant="primary"
//                      onClick={handleSave}
//                      disabled={saving}
//                      className="px-4"
//                    >
//                      {saving ? (
//                        <>
//                          <Spinner
//                            animation="border"
//                            size="sm"
//                            className="me-2"
//                          />
//                          Saving...
//                        </>
//                      ) : (
//                        "💾 Save Changes"
//                      )}
//                    </Button>
//                    <Button
//                      variant="outline-secondary"
//                      onClick={() => {
//                        setEditMode(false);
//                        fetchProfile();
//                      }}
//                      disabled={saving}
//                    >
//                      Cancel
//                    </Button>
//                  </div>
//                )}
//              </Form>
//
//              {!user.aadhaarVerified && (
//                <Card className="mt-4 border-warning">
//                  <Card.Body>
//                    <div className="d-flex justify-content-between align-items-center">
//                      <div>
//                        <h5 className="text-warning mb-1">
//                          ⚠️ Aadhaar Verification Required
//                        </h5>
//                        <p className="text-muted mb-0">
//                          Verify your Aadhaar to book products and access all
//                          features.
//                        </p>
//                      </div>
//                      <Button
//                        variant="warning"
//                        onClick={() => navigate("/verify-aadhaar")}
//                      >
//                        Verify Now
//                      </Button>
//                    </div>
//                  </Card.Body>
//                </Card>
//              )}
//
//              {/* My Products */}
//              <div className="mt-5">
//                <h4>My Listed Products</h4>
//                {productsLoading ? (
//                  <Spinner animation="border" />
//                ) : (
//                  <>
//                    {myProducts.length === 0 ? (
//                      <p>You have not listed any products yet.</p>
//                    ) : (
//                      <Row>
//                        {myProducts.map((product) => (
//                          <Col md={6} lg={4} key={product.id} className="mb-3">
//                            <Card>
//                              {product.images && product.images[0] && (
//                                <Card.Img
//                                  variant="top"
//                                  src={product.images[0]}
//                                  style={{
//                                    height: "200px",
//                                    objectFit: "cover",
//                                  }}
//                                />
//                              )}
//                              <Card.Body>
//                                <Card.Title>{product.name}</Card.Title>
//                                <Card.Text>₹{product.price} / day</Card.Text>
//                                <div className="d-flex justify-content-between">
//                                  <Button
//                                    variant="outline-primary"
//                                    size="sm"
//                                    onClick={() =>
//                                      navigate(`/add-product/${product.id}`)
//                                    }
//                                  >
//                                    ✏️ Edit
//                                  </Button>
//                                  <Button
//                                    variant="outline-danger"
//                                    size="sm"
//                                    onClick={() =>
//                                      handleDeleteProduct(product.id)
//                                    }
//                                  >
//                                    🗑 Delete
//                                  </Button>
//                                </div>
//                              </Card.Body>
//                            </Card>
//                          </Col>
//                        ))}
//                      </Row>
//                    )}
//                  </>
//                )}
//              </div>
//            </Card.Body>
//          </Card>
//        </Col>
//      </Row>
//    </Container>
//  );
//}
//
//export default Profile;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

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
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!user)
    return (
      <div className="mt-20 text-center">
        <p className="text-red-600 font-semibold">Failed to load profile</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 mb-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="rounded-full mx-auto border-4 border-blue-600 w-36 h-36 object-cover"
              />
            ) : (
              <div className="rounded-full mx-auto w-36 h-36 flex items-center justify-center bg-blue-600 text-white text-5xl border-4 border-blue-600">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-blue-600">{user.username || "User"}</h2>
          <span
            className={`inline-block px-3 py-1 rounded mt-2 text-white font-semibold ${
              user.aadhaarVerified ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            {user.aadhaarVerified ? "✓ Aadhaar Verified" : "⚠ Aadhaar Not Verified"}
          </span>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
            {error}
            <button className="font-bold" onClick={() => setError("")}>
              ✕
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
            {success}
            <button className="font-bold" onClick={() => setSuccess("")}>
              ✕
            </button>
          </div>
        )}

        {/* Profile Info Header */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Profile Information</h4>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                !editMode ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
            />
            <small className="text-gray-500">Email cannot be changed</small>
          </div>

          <div>
            <label className="font-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editMode}
              placeholder="+91 9876543210"
              className={`w-full border rounded px-3 py-2 mt-1 ${
                !editMode ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="font-semibold">Profile Picture</label>
            {editMode ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            ) : (
              <input
                type="text"
                value={formData.profilePicture ? "Image uploaded" : "No image"}
                disabled
                className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold">Address</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleInputChange}
              disabled={!editMode}
              placeholder="Enter your address"
              className={`w-full border rounded px-3 py-2 mt-1 ${
                !editMode ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                !editMode ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
          <div>
            <label className="font-semibold">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                !editMode ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
          <div>
            <label className="font-semibold">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 mt-1 ${
                !editMode ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Edit Buttons */}
        {editMode && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              {saving && (
                <span className="animate-spin border-t-2 border-b-2 border-white rounded-full h-4 w-4 mr-2"></span>
              )}
              💾 Save Changes
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                fetchProfile();
              }}
              disabled={saving}
              className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Aadhaar Verification */}
        {!user.aadhaarVerified && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex justify-between items-center">
            <div>
              <h5 className="font-semibold text-yellow-700 mb-1">
                ⚠️ Aadhaar Verification Required
              </h5>
              <p className="text-gray-600 text-sm">
                Verify your Aadhaar to book products and access all features.
              </p>
            </div>
            <button
              onClick={() => navigate("/verify-aadhaar")}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* My Products */}
        <div className="mt-8">
          <h4 className="font-semibold mb-4">My Listed Products</h4>
          {productsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : myProducts.length === 0 ? (
            <p>You have not listed any products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow rounded overflow-hidden flex flex-col"
                >
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-semibold text-lg">{product.name}</h5>
                      <p className="text-gray-600">₹{product.price} / day</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => navigate(`/add-product/${product.id}`)}
                        className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border border-red-600 text-red-600 px-3 py-1 rounded hover:bg-red-50 text-sm"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
