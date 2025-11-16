import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { searchProducts, getAllProducts, calculateDistance } from "../api";
import useGroqAI from "../hooks/useGroqAI";

const ProductList = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [smartSearchMode, setSmartSearchMode] = useState(false);
  const navigate = useNavigate();
  const { smartSearch } = useGroqAI();

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          console.log("Location access denied or unavailable");
        }
      );
    }
  }, []);

  // Load all products on component mount or when location changes
  useEffect(() => {
    loadAllProducts();
  }, [userLocation.lat, userLocation.lon]);

  const loadAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts(userLocation.lat, userLocation.lon);
      console.log('Products loaded:', data); // Debug log
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(`Failed to load products: ${err.message || 'Please try again.'}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      loadAllProducts();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Check if query looks like natural language (smart search)
      const isNaturalLanguage = query.split(' ').length > 2 || 
                                query.toLowerCase().includes('near') ||
                                query.toLowerCase().includes('within') ||
                                query.toLowerCase().includes('cheapest') ||
                                query.toLowerCase().includes('best');
      
      if (isNaturalLanguage && smartSearchMode) {
        // Use AI smart search
        try {
          const aiResult = await smartSearch(query);
          let searchQuery = query;
          
          // Try to extract keywords from AI response
          if (aiResult.parsed && aiResult.parsed.keywords) {
            searchQuery = aiResult.parsed.keywords;
          } else if (aiResult.searchQuery) {
            // Try to parse JSON from searchQuery string
            try {
              const parsed = JSON.parse(aiResult.searchQuery);
              if (parsed.keywords) {
                searchQuery = parsed.keywords;
              }
            } catch (e) {
              // Use original query if parsing fails
            }
          }
          
          const data = await searchProducts(searchQuery, userLocation.lat, userLocation.lon);
          setProducts(data || []);
        } catch (aiErr) {
          console.warn('Smart search failed, using regular search:', aiErr);
          // Fallback to regular search
          const data = await searchProducts(query, userLocation.lat, userLocation.lon);
          setProducts(data || []);
        }
      } else {
        // Regular search
        const data = await searchProducts(query, userLocation.lat, userLocation.lon);
        setProducts(data || []);
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance for display
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary mb-0">Available Products</h2>
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
                         variant={smartSearchMode ? "info" : "outline-info"}
                         onClick={() => setSmartSearchMode(!smartSearchMode)}
                         title="Toggle AI Smart Search"
                       >
                         🤖
                       </Button>
                       <Button
                         variant="primary"
                         onClick={handleSearch}
                         disabled={loading}
                         className="px-4"
                       >
                         {loading ? (
                           <>
                             <Spinner animation="border" size="sm" className="me-2" />
                             {smartSearchMode ? 'AI Searching...' : 'Searching...'}
                           </>
                         ) : (
                           smartSearchMode ? "🤖 AI Search" : "🔍 Search"
                         )}
                       </Button>
                       {query && (
                         <Button
                           variant="outline-secondary"
                           onClick={loadAllProducts}
                           disabled={loading}
                         >
                           Show All
                         </Button>
                       )}
                     </InputGroup>
                     {smartSearchMode && (
                       <Alert variant="info" className="mt-2 mb-0">
                         <small>✨ AI Smart Search enabled - Try natural language queries like "camera"</small>
                       </Alert>
                     )}
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
                    onClick={() => navigate(`/product/${p.id || p._id}`)}
                  >
                    {p.images && p.images.length > 0 && (
                      <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                        <img 
                          src={p.images[0]} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt={p.name}
                        />
                      </div>
                    )}
                    <Card.Body className="p-4">
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
