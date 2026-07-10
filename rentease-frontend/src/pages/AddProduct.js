//import React, { useState, useEffect } from "react";
//import {
//  Container,
//  Card,
//  Form,
//  Button,
//  Alert,
//  Row,
//  Col,
//  Spinner,
//} from "react-bootstrap";
//import { useNavigate, useParams } from "react-router-dom";
//
//function AddProduct() {
//  const navigate = useNavigate();
//  const { id } = useParams();
//  const isEditMode = Boolean(id);
//
//  const [formData, setFormData] = useState({
//    name: "",
//    description: "",
//    price: "",
//    locationName: "",
//    latitude: "",
//    longitude: "",
//    address: "",
//    images: [],
//  });
//  const [imagePreviews, setImagePreviews] = useState([]);
//  const [loading, setLoading] = useState(false);
//  const [locationLoading, setLocationLoading] = useState(false);
//  const [error, setError] = useState("");
//
//  const API_BASE_URL =
//    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
//  const getToken = () => localStorage.getItem("token");
//
//  useEffect(() => {
//    if (!isEditMode) return;
//
//    const fetchProduct = async () => {
//      try {
//        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
//          headers: { Authorization: `Bearer ${getToken()}` },
//        });
//        if (!res.ok) throw new Error("Failed to fetch product");
//        const data = await res.json();
//        setFormData({
//          name: data.name || "",
//          description: data.description || "",
//          price: data.price || "",
//          locationName: data.locationName || "",
//          latitude: data.latitude || "",
//          longitude: data.longitude || "",
//          address: data.address || "",
//          images: data.images || [],
//        });
//        setImagePreviews(data.images || []);
//      } catch (err) {
//        setError(err.message || "Failed to load product for editing");
//      }
//    };
//
//    fetchProduct();
//  }, [id]);
//
//  const getCurrentLocation = () => {
//    if (!navigator.geolocation) return alert("Geolocation not supported");
//
//    setLocationLoading(true);
//    navigator.geolocation.getCurrentPosition(
//      async (pos) => {
//        const lat = pos.coords.latitude.toFixed(6);
//        const lng = pos.coords.longitude.toFixed(6);
//        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
//
//        try {
//          const res = await fetch(
//            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
//            {
//              headers: { "User-Agent": "RentEase App" },
//            },
//          );
//          if (res.ok) {
//            const data = await res.json();
//            setFormData((prev) => ({
//              ...prev,
//              address: data.display_name || "",
//              locationName: data.display_name.split(",")[0] || "",
//            }));
//          }
//        } catch (err) {
//          console.error("Reverse geocoding failed", err);
//        } finally {
//          setLocationLoading(false);
//        }
//      },
//      () => {
//        setLocationLoading(false);
//        alert("Unable to get location");
//      },
//      { enableHighAccuracy: true, timeout: 10000 },
//    );
//  };
//
//  const handleImageChange = async (e) => {
//    const files = Array.from(e.target.files);
//    if (files.length + formData.images.length > 5) {
//      setError("Maximum 5 images allowed");
//      return;
//    }
//
//    const newImages = [];
//    const newPreviews = [];
//
//    for (const file of files) {
//      if (file.type.startsWith("image/")) {
//        const reader = new FileReader();
//        await new Promise((resolve) => {
//          reader.onloadend = () => {
//            newPreviews.push(reader.result);
//            newImages.push(reader.result);
//            resolve();
//          };
//          reader.readAsDataURL(file);
//        });
//      }
//    }
//
//    setImagePreviews((prev) => [...prev, ...newPreviews]);
//    setFormData((prev) => ({
//      ...prev,
//      images: [...prev.images, ...newImages],
//    }));
//  };
//
//  const removeImage = (index) => {
//    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//    setFormData((prev) => ({
//      ...prev,
//      images: prev.images.filter((_, i) => i !== index),
//    }));
//  };
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    setError("");
//
//    if (
//      !formData.name ||
//      !formData.description ||
//      !formData.price ||
//      !formData.latitude ||
//      !formData.longitude
//    ) {
//      setError("Please fill in all required fields");
//      return;
//    }
//
//    setLoading(true);
//    try {
//      const method = isEditMode ? "PUT" : "POST";
//      const url = isEditMode
//        ? `${API_BASE_URL}/api/products/${id}`
//        : `${API_BASE_URL}/api/products`;
//
//      const res = await fetch(url, {
//        method,
//        headers: {
//          "Content-Type": "application/json",
//          Authorization: `Bearer ${getToken()}`,
//        },
//        body: JSON.stringify({
//          name: formData.name,
//          description: formData.description,
//          price: parseFloat(formData.price),
//          latitude: parseFloat(formData.latitude),
//          longitude: parseFloat(formData.longitude),
//          locationName: formData.locationName || formData.address || "",
//          address: formData.address,
//          images: formData.images,
//        }),
//      });
//
//      if (!res.ok) {
//        const msg =
//          (await res.json()).message ||
//          (isEditMode ? "Failed to update product" : "Failed to add product");
//        throw new Error(msg);
//      }
//
//      alert(`Product ${isEditMode ? "updated" : "added"} successfully!`);
//      navigate("/profile");
//    } catch (err) {
//      setError(err.message);
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  return (
//    <Container className="mt-4 mb-5">
//      <Row className="justify-content-center">
//        <Col md={8}>
//          <Card>
//            <Card.Header>
//              <h3>
//                {isEditMode ? "Edit Product" : "List Your Product for Rent"}
//              </h3>
//            </Card.Header>
//            <Card.Body>
//              {error && <Alert variant="danger">{error}</Alert>}
//              <Form onSubmit={handleSubmit}>
//                <Form.Group className="mb-3">
//                  <Form.Label>Product Name *</Form.Label>
//                  <Form.Control
//                    type="text"
//                    value={formData.name}
//                    onChange={(e) =>
//                      setFormData({ ...formData, name: e.target.value })
//                    }
//                    required
//                  />
//                </Form.Group>
//
//                <Form.Group className="mb-3">
//                  <Form.Label>Description *</Form.Label>
//                  <Form.Control
//                    as="textarea"
//                    rows={4}
//                    value={formData.description}
//                    onChange={(e) =>
//                      setFormData({ ...formData, description: e.target.value })
//                    }
//                    required
//                  />
//                </Form.Group>
//
//                <Form.Group className="mb-3">
//                  <Form.Label>Price per Day (₹) *</Form.Label>
//                  <Form.Control
//                    type="number"
//                    step="0.01"
//                    value={formData.price}
//                    onChange={(e) =>
//                      setFormData({ ...formData, price: e.target.value })
//                    }
//                    required
//                  />
//                </Form.Group>
//
//                <Card className="mb-3 border-primary">
//                  <Card.Header className="bg-primary text-white">
//                    📍 Location
//                  </Card.Header>
//                  <Card.Body>
//                    {/* ✅ Get My Location button clearly visible */}
//                    <Button
//                      variant="primary"
//                      onClick={getCurrentLocation}
//                      disabled={locationLoading}
//                      className="mb-3 w-100"
//                    >
//                      {locationLoading ? (
//                        <>
//                          <Spinner
//                            animation="border"
//                            size="sm"
//                            className="me-2"
//                          />{" "}
//                          Getting Location...
//                        </>
//                      ) : (
//                        "📍 Get My Location"
//                      )}
//                    </Button>
//
//                    <Form.Group className="mb-2">
//                      <Form.Label>Full Address</Form.Label>
//                      <Form.Control
//                        as="textarea"
//                        rows={2}
//                        value={formData.address}
//                        onChange={(e) =>
//                          setFormData({ ...formData, address: e.target.value })
//                        }
//                      />
//                    </Form.Group>
//
//                    <Form.Group className="mb-2">
//                      <Form.Label>Location Name</Form.Label>
//                      <Form.Control
//                        type="text"
//                        value={formData.locationName}
//                        onChange={(e) =>
//                          setFormData({
//                            ...formData,
//                            locationName: e.target.value,
//                          })
//                        }
//                      />
//                    </Form.Group>
//
//                    <Row>
//                      <Col>
//                        <Form.Group className="mb-2">
//                          <Form.Label>Latitude *</Form.Label>
//                          <Form.Control
//                            type="number"
//                            step="0.000001"
//                            value={formData.latitude}
//                            onChange={(e) =>
//                              setFormData({
//                                ...formData,
//                                latitude: e.target.value,
//                              })
//                            }
//                            required
//                          />
//                        </Form.Group>
//                      </Col>
//                      <Col>
//                        <Form.Group className="mb-2">
//                          <Form.Label>Longitude *</Form.Label>
//                          <Form.Control
//                            type="number"
//                            step="0.000001"
//                            value={formData.longitude}
//                            onChange={(e) =>
//                              setFormData({
//                                ...formData,
//                                longitude: e.target.value,
//                              })
//                            }
//                            required
//                          />
//                        </Form.Group>
//                      </Col>
//                    </Row>
//                  </Card.Body>
//                </Card>
//
//                <Form.Group className="mb-3">
//                  <Form.Label>Product Images (Max 5)</Form.Label>
//                  <Form.Control
//                    type="file"
//                    accept="image/*"
//                    multiple
//                    onChange={handleImageChange}
//                  />
//                  {imagePreviews.length > 0 && (
//                    <Row className="mt-2">
//                      {imagePreviews.map((img, i) => (
//                        <Col md={4} key={i} className="mb-2 position-relative">
//                          <img
//                            src={img}
//                            alt={`Preview ${i + 1}`}
//                            className="img-thumbnail"
//                            style={{
//                              width: "100%",
//                              height: "150px",
//                              objectFit: "cover",
//                            }}
//                          />
//                          <Button
//                            size="sm"
//                            variant="danger"
//                            className="position-absolute top-0 end-0 m-1"
//                            onClick={() => removeImage(i)}
//                          >
//                            ×
//                          </Button>
//                        </Col>
//                      ))}
//                    </Row>
//                  )}
//                </Form.Group>
//
//                <div className="d-flex gap-2">
//                  <Button type="submit" variant="primary" disabled={loading}>
//                    {loading
//                      ? isEditMode
//                        ? "Updating..."
//                        : "Adding..."
//                      : isEditMode
//                        ? "Update Product"
//                        : "List Product"}
//                  </Button>
//                  <Button
//                    variant="outline-secondary"
//                    type="button"
//                    onClick={() => navigate("/profile")}
//                  >
//                    Cancel
//                  </Button>
//                </div>
//              </Form>
//            </Card.Body>
//          </Card>
//        </Col>
//      </Row>
//    </Container>
//  );
//}
//
//export default AddProduct;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
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
    <div className="min-h-screen py-12 bg-gray-50 flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h3 className="text-xl font-semibold">
              {isEditMode
                ? "Edit Product"
                : "List Your Product for Rent"}
            </h3>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  Price per Day (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location Card */}
              <div className="mb-4 border border-blue-300 rounded">
                <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                  📍 Location
                </div>
                <div className="p-4">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="w-full mb-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {locationLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    ) : null}
                    {locationLoading ? "Getting Location..." : "📍 Get My Location"}
                  </button>

                  <div className="mb-2">
                    <label className="block font-semibold mb-1">Full Address</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block font-semibold mb-1">Location Name</label>
                    <input
                      type="text"
                      value={formData.locationName}
                      onChange={(e) =>
                        setFormData({ ...formData, locationName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Latitude *</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData({ ...formData, latitude: e.target.value })
                        }
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Longitude *</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({ ...formData, longitude: e.target.value })
                        }
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">Product Images (Max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="mb-2"
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-36 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                    ? "Update Product"
                    : "List Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-100"
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
