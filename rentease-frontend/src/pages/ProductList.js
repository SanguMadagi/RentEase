//import React, { useState, useEffect } from "react";
//import {
//  Container,
//  Row,
//  Col,
//  Card,
//  Form,
//  Button,
//  InputGroup,
//  Alert,
//  Spinner,
//  Badge,
//} from "react-bootstrap";
//import { useNavigate, useLocation } from "react-router-dom";
//import { searchProducts, getAllProducts, calculateDistance } from "../api";
//
//const ProductList = () => {
//  const [query, setQuery] = useState("");
//  const [products, setProducts] = useState([]);
//  const [loading, setLoading] = useState(false);
//  const [error, setError] = useState(null);
//  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
//  const [locationReady, setLocationReady] = useState(false);
//
//  const navigate = useNavigate();
//  const location = useLocation();
//  const isProfilePage = location.pathname === "/profile";
//
//  useEffect(() => {
//    if (navigator.geolocation) {
//      navigator.geolocation.getCurrentPosition(
//        (position) => {
//          setUserLocation({
//            lat: position.coords.latitude,
//            lon: position.coords.longitude,
//          });
//          setLocationReady(true);
//        },
//        () => {
//          // Even if denied, mark as ready to load products
//          setLocationReady(true);
//        },
//      );
//    } else {
//      setLocationReady(true);
//    }
//  }, []);
//
//  useEffect(() => {
//    if (locationReady) {
//      loadProducts();
//    }
//  }, [locationReady]);
//
//  const loadProducts = async () => {
//    setLoading(true);
//    setError(null);
//    try {
//      const data = await getAllProducts(userLocation.lat, userLocation.lon);
//      let filtered = Array.isArray(data) ? data : [];
//      if (isProfilePage) {
//        const currentUserId = localStorage.getItem("userId");
//        filtered = filtered.filter((p) => p.lenderId === currentUserId);
//      }
//      setProducts(filtered);
//    } catch (err) {
//      console.error(err);
//      setError("Failed to load products. Please try again.");
//      setProducts([]);
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const handleSearch = async () => {
//    if (!query.trim()) {
//      loadProducts();
//      return;
//    }
//    setLoading(true);
//    setError(null);
//    try {
//      const data = await searchProducts(
//        query,
//        userLocation.lat,
//        userLocation.lon,
//      );
//      let filtered = data || [];
//      if (isProfilePage) {
//        const currentUserId = localStorage.getItem("userId");
//        filtered = filtered.filter((p) => p.lenderId === currentUserId);
//      }
//      setProducts(filtered);
//    } catch (err) {
//      setError("Search failed. Please try again.");
//      console.error(err);
//      setProducts([]);
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  const getDistance = (product) => {
//    if (
//      userLocation.lat &&
//      userLocation.lon &&
//      product.latitude &&
//      product.longitude
//    ) {
//      const distance = calculateDistance(
//        userLocation.lat,
//        userLocation.lon,
//        product.latitude,
//        product.longitude,
//      );
//      return distance < 1
//        ? `${Math.round(distance * 1000)}m away`
//        : `${distance.toFixed(1)}km away`;
//    }
//    return product.locationName || "Location not available";
//  };
//
//  const handleKeyPress = (e) => {
//    if (e.key === "Enter") handleSearch();
//  };
//
//  const handleEdit = (id) => {
//    navigate(`/add-product/${id}`);
//  };
//
//  return (
//    <Container className="mt-4 mb-5">
//      <Row>
//        <Col>
//          <div className="d-flex justify-content-between align-items-center mb-4">
//            <h2 className="fw-bold text-primary mb-0">
//              {isProfilePage ? "My Products" : "Available Products"}
//            </h2>
//            <Button
//              variant="success"
//              onClick={() => navigate("/add-product")}
//              className="fw-semibold"
//            >
//              + Add Product
//            </Button>
//          </div>
//
//          {/* Search Bar */}
//          <Row className="mb-4">
//            <Col md={10} className="mx-auto">
//              <InputGroup size="lg" className="shadow-sm">
//                <Form.Control
//                  type="text"
//                  placeholder="Search products... (e.g., 'dslr')"
//                  value={query}
//                  onChange={(e) => setQuery(e.target.value)}
//                  onKeyPress={handleKeyPress}
//                  className="py-3"
//                />
//                <Button
//                  variant="primary"
//                  onClick={handleSearch}
//                  disabled={loading}
//                  className="px-4"
//                >
//                  {loading ? "Searching..." : "🔍 Search"}
//                </Button>
//                {query && (
//                  <Button
//                    variant="outline-secondary"
//                    onClick={loadProducts}
//                    disabled={loading}
//                  >
//                    Show All
//                  </Button>
//                )}
//              </InputGroup>
//            </Col>
//          </Row>
//
//          {/* Error Message */}
//          {error && (
//            <Alert variant="danger" dismissible onClose={() => setError(null)}>
//              {error}
//            </Alert>
//          )}
//
//          {/* Loading Spinner */}
//          {loading && products.length === 0 && (
//            <div className="text-center my-5">
//              <Spinner animation="border" role="status">
//                <span className="visually-hidden">Loading...</span>
//              </Spinner>
//            </div>
//          )}
//
//          {/* No Products Message */}
//          {!loading && products.length === 0 && !error && (
//            <Alert variant="info" className="text-center">
//              No products found. Be the first to list a product!
//            </Alert>
//          )}
//
//          {/* Products Grid */}
//          {!loading && products.length > 0 && (
//            <Row>
//              {products.map((p) => (
//                <Col key={p.id || p._id} md={6} lg={4} className="mb-4">
//                  <Card
//                    className="h-100 shadow-lg border-0"
//                    style={{ cursor: "pointer", transition: "transform 0.2s" }}
//                    onMouseEnter={(e) =>
//                      (e.currentTarget.style.transform = "translateY(-5px)")
//                    }
//                    onMouseLeave={(e) =>
//                      (e.currentTarget.style.transform = "translateY(0)")
//                    }
//                  >
//                    {p.images && p.images.length > 0 && (
//                      <div
//                        style={{
//                          height: "220px",
//                          overflow: "hidden",
//                          backgroundColor: "#f8f9fa",
//                        }}
//                      >
//                        <img
//                          src={p.images[0]}
//                          style={{
//                            width: "100%",
//                            height: "100%",
//                            objectFit: "cover",
//                          }}
//                          alt={p.name}
//                          onClick={() =>
//                            isProfilePage
//                              ? handleEdit(p.id || p._id)
//                              : navigate(`/product/${p.id || p._id}`)
//                          }
//                        />
//                      </div>
//                    )}
//                    <Card.Body
//                      className="p-4"
//                      onClick={() =>
//                        !isProfilePage && navigate(`/product/${p.id || p._id}`)
//                      }
//                    >
//                      <Card.Title className="fw-bold mb-2">{p.name}</Card.Title>
//                      <Card.Text
//                        className="text-muted small mb-3"
//                        style={{ minHeight: "48px" }}
//                      >
//                        {p.description
//                          ? p.description.length > 100
//                            ? p.description.substring(0, 100) + "..."
//                            : p.description
//                          : "No description available"}
//                      </Card.Text>
//                      <div className="mb-3">
//                        <small className="text-muted d-flex align-items-center">
//                          <span className="me-1">📍</span> {getDistance(p)}
//                        </small>
//                      </div>
//                      <div className="d-flex justify-content-between align-items-center">
//                        <h5 className="text-primary mb-0 fw-bold">
//                          ₹{p.price}
//                          <small className="text-muted">/day</small>
//                        </h5>
//                        <Badge
//                          bg={p.available ? "success" : "danger"}
//                          className="px-3 py-2"
//                        >
//                          {p.available ? "Available" : "Booked"}
//                        </Badge>
//                      </div>
//                      {isProfilePage && (
//                        <Button
//                          variant="outline-primary"
//                          size="sm"
//                          className="mt-3"
//                          onClick={() => handleEdit(p.id || p._id)}
//                        >
//                          Edit
//                        </Button>
//                      )}
//                    </Card.Body>
//                  </Card>
//                </Col>
//              ))}
//            </Row>
//          )}
//        </Col>
//      </Row>
//    </Container>
//  );
//};
//
//export default ProductList;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProducts, getAllProducts, calculateDistance } from "../api";

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
    <div className="max-w-6xl mx-auto mt-6 px-4 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          {isProfilePage ? "My Products" : "Available Products"}
        </h2>
        <button
          onClick={() => navigate("/add-product")}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-2 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search products... (e.g., 'dslr')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border rounded px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
        {query && (
          <button
            onClick={loadProducts}
            disabled={loading}
            className="px-4 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:bg-gray-100"
          >
            Show All
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && products.length === 0 && (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No Products Message */}
      {!loading && products.length === 0 && !error && (
        <div className="bg-blue-50 text-blue-700 text-center px-4 py-3 rounded mb-4">
          No products found. Be the first to list a product!
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id || p._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition hover:-translate-y-1"
          >
            {p.images && p.images.length > 0 && (
              <div className="h-56 bg-gray-100 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onClick={() =>
                    isProfilePage
                      ? handleEdit(p.id || p._id)
                      : navigate(`/product/${p.id || p._id}`)
                  }
                />
              </div>
            )}
            <div
              className="p-4"
              onClick={() =>
                !isProfilePage && navigate(`/product/${p.id || p._id}`)
              }
            >
              <h3 className="font-bold text-lg mb-2">{p.name}</h3>
              <p className="text-gray-600 text-sm mb-3 min-h-[48px]">
                {p.description
                  ? p.description.length > 100
                    ? p.description.substring(0, 100) + "..."
                    : p.description
                  : "No description available"}
              </p>
              <div className="mb-3 text-gray-500 text-sm flex items-center">
                <span className="mr-1">📍</span> {getDistance(p)}
              </div>
              <div className="flex justify-between items-center">
                <h5 className="text-blue-600 font-bold">
                  ₹{p.price}{" "}
                  <span className="text-gray-500 text-sm font-normal">/day</span>
                </h5>
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    p.available ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {p.available ? "Available" : "Booked"}
                </span>
              </div>
              {isProfilePage && (
                <button
                  onClick={() => handleEdit(p.id || p._id)}
                  className="mt-3 w-full border border-blue-600 text-blue-600 rounded px-3 py-2 hover:bg-blue-50"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
