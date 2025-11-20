import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProducts, getAllProducts, calculateDistance } from "../api";

const ProductList = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });

  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => console.log("Location access denied or unavailable")
      );
    }
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
  }, [userLocation.lat, userLocation.lon]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts(userLocation.lat, userLocation.lon);
      let filtered = Array.isArray(data) ? data : [];
      if (isProfilePage) {
        const currentUserId = localStorage.getItem("userId");
        filtered = filtered.filter(p => p.lenderId === currentUserId);
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
    if (!query.trim()) {
      loadProducts();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query, userLocation.lat, userLocation.lon);
      let filtered = data || [];
      if (isProfilePage) {
        const currentUserId = localStorage.getItem("userId");
        filtered = filtered.filter(p => p.lenderId === currentUserId);
      }
      setProducts(filtered);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleEdit = (id) => {
    navigate(`/add-product/${id}`);
  };

  return (
    <Container className="mt-4 mb-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary mb-0">
              {isProfilePage ? "My Products" : "Available Products"}
            </h2>
            <Button
              variant="success"
              onClick={() => navigate('/add-product')}
              className="fw-semibold"
            >
              + Add Product
            </Button>
          </div>

          {/* Search Bar */}
          <Row className="mb-4">
            <Col md={10} className="mx-auto">
              <InputGroup size="lg" className="shadow-sm">
                <Form.Control
                  type="text"
                  placeholder="Search products... (e.g., 'dslr')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="py-3"
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4"
                >
                  {loading ? "Searching..." : "🔍 Search"}
                </Button>
                {query && (
                  <Button
                    variant="outline-secondary"
                    onClick={loadProducts}
                    disabled={loading}
                  >
                    Show All
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>

          {/* Error Message */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Loading Spinner */}
          {loading && products.length === 0 && (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {/* No Products Message */}
          {!loading && products.length === 0 && !error && (
            <Alert variant="info" className="text-center">
              No products found. Be the first to list a product!
            </Alert>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <Row>
              {products.map((p) => (
                <Col key={p.id || p._id} md={6} lg={4} className="mb-4">
                  <Card
                    className="h-100 shadow-lg border-0"
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {p.images && p.images.length > 0 && (
                      <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                        <img
                          src={p.images[0]}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt={p.name}
                          onClick={() => isProfilePage ? handleEdit(p.id || p._id) : navigate(`/product/${p.id || p._id}`)}
                        />
                      </div>
                    )}
                    <Card.Body className="p-4" onClick={() => !isProfilePage && navigate(`/product/${p.id || p._id}`)}>
                      <Card.Title className="fw-bold mb-2">{p.name}</Card.Title>
                      <Card.Text className="text-muted small mb-3" style={{ minHeight: '48px' }}>
                        {p.description ? (p.description.length > 100
                          ? p.description.substring(0, 100) + '...'
                          : p.description)
                          : "No description available"}
                      </Card.Text>
                      <div className="mb-3">
                        <small className="text-muted d-flex align-items-center">
                          <span className="me-1">📍</span> {getDistance(p)}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="text-primary mb-0 fw-bold">₹{p.price}<small className="text-muted">/day</small></h5>
                        <Badge bg={p.available ? "success" : "danger"} className="px-3 py-2">
                          {p.available ? "Available" : "Booked"}
                        </Badge>
                      </div>
                      {isProfilePage && (
                        <Button variant="outline-primary" size="sm" className="mt-3" onClick={() => handleEdit(p.id || p._id)}>
                          Edit
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
