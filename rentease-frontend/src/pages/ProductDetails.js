import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Spinner, ListGroup, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [owner, setOwner] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [error, setError] = useState('');
    const [showContactModal, setShowContactModal] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const getToken = () => localStorage.getItem('token');

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();

            // Handle response with owner info or just product
            if (data.product) {
                setProduct(data.product);
                setOwner(data.owner);
            } else {
                setProduct(data);
            }
        } catch (err) {
            setError('Failed to load product details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/product/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data || []);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        }
    }

    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserProfile(data);
            }
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
        }
    };

    const handleBooking = async () => {
        if (!getToken()) {
            alert('Please login to book a product');
            navigate('/login');
            return;
        }

        // Check if Aadhaar is verified
        if (!userProfile?.aadhaarVerified) {
            // Redirect to Aadhaar verification
            navigate('/verify-aadhaar', {
                state: { productId: id, redirectTo: 'payment' }
            });
            return;
        }

        // If Aadhaar verified, go to payment
        navigate('/payment', { state: { productId: id } });
    }

    const handleContactOwner = () => {
        if (owner) {
            setShowContactModal(true);
        } else {
            alert('Owner information not available');
        }
    }

    const handleReview = async () => {
        if (!getToken()) {
            alert('Please login to add a review');
            navigate('/login');
            return;
        }

        setReviewLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ productId: id, rating, comment }),
            });

            if (!response.ok) throw new Error('Review failed');

            setRating(5);
            setComment('');
            fetchReviews();
        } catch (err) {
            alert('Review failed. Please try again.');
            console.error(err);
        } finally {
            setReviewLoading(false);
        }
    }

    useEffect(() => {
        fetchProduct();
        fetchReviews();
        fetchUserProfile();
    }, [id]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error || !product) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error || 'Product not found'}</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Back to Products
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/')}>
                ← Back to Products
            </Button>

            <Row>
                <Col md={8}>
                    {/* Product Images */}
                    {product.images && product.images.length > 0 && (
                        <Card className="mb-3">
                            <Card.Body>
                                <Row>
                                    {product.images.map((image, index) => (
                                        <Col md={6} key={index} className="mb-2">
                                            <img
                                                src={image}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="img-fluid rounded"
                                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <Card.Title className="h2">{product.name}</Card.Title>
                                    <Badge bg={product.available ? "success" : "danger"} className="ms-2">
                                        {product.available ? "Available" : "Booked"}
                                    </Badge>
                                </div>
                                <h3 className="text-primary mb-0">₹{product.price}/day</h3>
                            </div>

                            <Card.Text className="lead">{product.description || "No description available"}</Card.Text>

                            {/* Location Section */}
                            {(product.locationName || (product.latitude && product.longitude)) && (
                                <Card className="mt-3 mb-3 border-info">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-2">📍 Location</h6>
                                                {product.locationName && (
                                                    <p className="mb-1">{product.locationName}</p>
                                                )}
                                                {product.latitude && product.longitude && (
                                                    <p className="text-muted small mb-2">
                                                        Coordinates: {product.latitude.toFixed(6)}, {product.longitude.toFixed(6)}
                                                    </p>
                                                )}
                                            </div>
                                            {product.latitude && product.longitude && (
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    href={`https://www.google.com/maps?q=${product.latitude},${product.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    🗺️ Open in Google Maps
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}

                            {/* Map Preview */}
                            {product.latitude && product.longitude && (
                                <Card className="mb-3">
                                    <Card.Header className="bg-light">
                                        <h6 className="mb-0">📍 Map View</h6>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <MapView
                                            latitude={product.latitude}
                                            longitude={product.longitude}
                                            productName={product.name}
                                        />
                                    </Card.Body>
                                </Card>
                            )}

                            <div className="d-flex gap-2 mt-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleBooking}
                                    disabled={!product.available}
                                    className="flex-fill"
                                >
                                    {!userProfile?.aadhaarVerified ? '🔒 Verify & Book' : '📅 Book Now'}
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    size="lg"
                                    onClick={handleContactOwner}
                                    className="flex-fill"
                                >
                                    📞 Contact Owner
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Reviews Section */}
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">Reviews ({reviews.length})</h4>
                        </Card.Header>
                        <Card.Body>
                            {reviews.length === 0 ? (
                                <p className="text-muted">No reviews yet. Be the first to review!</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {reviews.map(r => (
                                        <ListGroup.Item key={r.id || r._id}>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong>{'⭐'.repeat(r.rating)}</strong>
                                                    <p className="mb-0 mt-1">{r.comment}</p>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                            <hr className="my-4" />

                            <h5>Add Your Review</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Select
                                        value={rating}
                                        onChange={e => setRating(Number(e.target.value))}
                                    >
                                        {[1,2,3,4,5].map(n => (
                                            <option key={n} value={n}>
                                                {n} {n === 1 ? 'Star' : 'Stars'}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Write your review..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    />
                                </Form.Group>

                                <Button
                                    variant="outline-primary"
                                    onClick={handleReview}
                                    disabled={reviewLoading || !comment.trim()}
                                >
                                    {reviewLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Contact Owner Modal */}
            <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>📞 Contact Product Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {owner ? (
                        <div>
                            <div className="mb-3">
                                <strong>Name:</strong> {owner.username || 'Not provided'}
                            </div>
                            {owner.phone && (
                                <div className="mb-3">
                                    <strong>Phone:</strong>{' '}
                                    <a href={`tel:${owner.phone}`} className="text-decoration-none">
                                        {owner.phone}
                                    </a>
                                </div>
                            )}
                            {owner.email && (
                                <div className="mb-3">
                                    <strong>Email:</strong>{' '}
                                    <a href={`mailto:${owner.email}`} className="text-decoration-none">
                                        {owner.email}
                                    </a>
                                </div>
                            )}
                            <Alert variant="info" className="mt-3 mb-0">
                                <small>
                                    💡 In a production app, this would also include an in-app chat feature for secure communication.
                                </small>
                            </Alert>
                        </div>
                    ) : (
                        <p className="text-muted">Owner information not available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowContactModal(false)}>
                        Close
                    </Button>
                    {owner?.phone && (
                        <Button
                            variant="primary"
                            href={`tel:${owner.phone}`}
                            onClick={() => setShowContactModal(false)}
                        >
                            📞 Call Now
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ProductDetails;

