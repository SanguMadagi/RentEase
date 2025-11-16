//import React, { useState } from 'react';
//import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
//import { useNavigate } from 'react-router-dom';
//import useGroqAI from '../hooks/useGroqAI';
//
//function AddProduct() {
//    const navigate = useNavigate();
//    const [formData, setFormData] = useState({
//        name: '',
//        description: '',
//        price: '',
//        locationName: '',
//        latitude: '',
//        longitude: '',
//        address: '',
//        images: []
//    });
//    const [locationLoading, setLocationLoading] = useState(false);
//    const [imagePreviews, setImagePreviews] = useState([]);
//    const [error, setError] = useState('');
//    const [loading, setLoading] = useState(false);
//    const [aiLoading, setAiLoading] = useState(false);
//    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
//
//    const getToken = () => localStorage.getItem('token');
//    const { generateProductDescription, cleanAddress, detectSpam, detectProductImage } = useGroqAI();
//
//    // Get user's current location and reverse geocode to address
//    const getCurrentLocation = async () => {
//        if (!navigator.geolocation) {
//            alert('Geolocation is not supported by your browser.');
//            return;
//        }
//
//        setLocationLoading(true);
//        try {
//            navigator.geolocation.getCurrentPosition(
//                async (position) => {
//                    const lat = position.coords.latitude.toFixed(6);
//                    const lng = position.coords.longitude.toFixed(6);
//
//                    // Update coordinates immediately
//                    setFormData(prev => ({
//                        ...prev,
//                        latitude: lat,
//                        longitude: lng
//                    }));
//
//                    // Reverse geocode using Nominatim (OpenStreetMap)
//                    try {
//                        const response = await fetch(
//                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
//                            {
//                                headers: {
//                                    'User-Agent': 'RentEase App' // Required by Nominatim
//                                }
//                            }
//                        );
//
//                        if (response.ok) {
//                            const data = await response.json();
//                            const address = data.display_name || '';
//
//                            setFormData(prev => ({
//                                ...prev,
//                                address: address,
//                                locationName: address.split(',')[0] || '' // Use first part as location name
//                            }));
//                        } else {
//                            console.warn('Failed to get address from coordinates');
//                        }
//                    } catch (geocodeError) {
//                        console.error('Reverse geocoding error:', geocodeError);
//                        // Still keep the coordinates even if address fetch fails
//                    } finally {
//                        setLocationLoading(false);
//                    }
//                },
//                (err) => {
//                    setLocationLoading(false);
//                    alert('Unable to get your location. Please enter manually.');
//                    console.error(err);
//                }
//            );
//        } catch (error) {
//            setLocationLoading(false);
//            alert('Error getting location. Please try again.');
//            console.error(error);
//        }
//    };
//
//    // Handle image upload with AI detection
//    const handleImageChange = async (e) => {
//        const files = Array.from(e.target.files);
//        if (files.length > 5) {
//            setError('Maximum 5 images allowed');
//            return;
//        }
//
//        const newPreviews = [];
//        const newImages = [];
//        let firstImageDetected = false;
//
//        for (const file of files) {
//            if (file.type.startsWith('image/')) {
//                const reader = new FileReader();
//                await new Promise((resolve) => {
//                    reader.onloadend = async () => {
//                        const base64 = reader.result;
//                        newPreviews.push(base64);
//                        newImages.push(base64);
//
//                        // AI detection for first image only
//                        if (!firstImageDetected && newPreviews.length === 1) {
//                            firstImageDetected = true;
//                            try {
//                                setAiLoading(true);
//                                const detection = await detectProductImage(base64);
//                                if (detection.productName && !formData.name) {
//                                    setFormData(prev => ({
//                                        ...prev,
//                                        name: detection.productName
//                                    }));
//                                }
//                            } catch (err) {
//                                console.log('AI detection failed:', err);
//                            } finally {
//                                setAiLoading(false);
//                            }
//                        }
//
//                        if (newPreviews.length === files.length) {
//                            setImagePreviews([...imagePreviews, ...newPreviews]);
//                            setFormData(prev => ({
//                                ...prev,
//                                images: [...prev.images, ...newImages]
//                            }));
//                        }
//                        resolve();
//                    };
//                    reader.readAsDataURL(file);
//                });
//            }
//        }
//    };
//
//    // Generate product description using AI
//    const handleGenerateDescription = async () => {
//        if (!formData.name.trim()) {
//            setError('Please enter product name first');
//            return;
//        }
//
//        setAiLoading(true);
//        try {
//            const description = await generateProductDescription(formData.name);
//            setFormData(prev => ({ ...prev, description }));
//        } catch (err) {
//            setError('Failed to generate description: ' + err.message);
//        } finally {
//            setAiLoading(false);
//        }
//    };
//
//    // Clean address using AI
//    const handleCleanAddress = async () => {
//        if (!formData.address.trim()) {
//            setError('Please get location or enter address first');
//            return;
//        }
//
//        setAiLoading(true);
//        try {
//            const cleaned = await cleanAddress(formData.address);
//            setFormData(prev => ({ ...prev, address: cleaned }));
//        } catch (err) {
//            setError('Failed to clean address: ' + err.message);
//        } finally {
//            setAiLoading(false);
//        }
//    };
//
//    const removeImage = (index) => {
//        const newPreviews = imagePreviews.filter((_, i) => i !== index);
//        const newImages = formData.images.filter((_, i) => i !== index);
//        setImagePreviews(newPreviews);
//        setFormData(prev => ({ ...prev, images: newImages }));
//    };
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setError('');
//
//        // Validation
//        if (!formData.name || !formData.description || !formData.price) {
//            setError('Please fill in all required fields');
//            return;
//        }
//
//        if (!formData.latitude || !formData.longitude) {
//            setError('Please provide location (use "Get My Location" or enter manually)');
//            return;
//        }
//
//        // Spam detection before submission
//        setAiLoading(true);
//        try {
//            const spamText = `${formData.name} ${formData.description}`;
//            const isSpam = await detectSpam(spamText);
//            if (isSpam) {
//                setError('Content contains inappropriate or spam content. Please revise your product details.');
//                setAiLoading(false);
//                return;
//            }
//        } catch (err) {
//            console.warn('Spam detection failed, proceeding anyway:', err);
//        } finally {
//            setAiLoading(false);
//        }
//
//        setLoading(true);
//        try {
//            const response = await fetch(`${API_BASE_URL}/api/products`, {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                    'Authorization': `Bearer ${getToken()}`,
//                },
//                body: JSON.stringify({
//                    name: formData.name,
//                    description: formData.description,
//                    price: parseFloat(formData.price),
//                    latitude: parseFloat(formData.latitude),
//                    longitude: parseFloat(formData.longitude),
//                    locationName: formData.locationName || formData.address || '',
//                    images: formData.images
//                }),
//            });
//
//            if (!response.ok) {
//                let errorMessage = 'Failed to add product';
//                try {
//                    const errorData = await response.json();
//                    errorMessage = errorData.message || errorData.error || errorData || errorMessage;
//                } catch (e) {
//                    const text = await response.text();
//                    errorMessage = text || errorMessage;
//                }
//                throw new Error(errorMessage);
//            }
//
//            alert('Product added successfully!');
//            navigate('/');
//        } catch (err) {
//            setError(err.message || 'Failed to add product. Please try again.');
//            console.error(err);
//        } finally {
//            setLoading(false);
//        }
//    };
//
//    return (
//        <Container className="mt-4 mb-5">
//            <Row className="justify-content-center">
//                <Col md={8}>
//                    <Card>
//                        <Card.Header>
//                            <h3 className="mb-0">List Your Product for Rent</h3>
//                        </Card.Header>
//                        <Card.Body>
//                            {error && <Alert variant="danger">{error}</Alert>}
//
//                            <Form onSubmit={handleSubmit}>
//                                <Form.Group className="mb-3">
//                                    <Form.Label>Product Name *</Form.Label>
//                                    <Form.Control
//                                        type="text"
//                                        placeholder="e.g., Canon DSLR Camera"
//                                        value={formData.name}
//                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                        required
//                                    />
//                                </Form.Group>
//
//                                <Form.Group className="mb-3">
//                                    <Form.Label>Description *</Form.Label>
//                                    <Form.Control
//                                        as="textarea"
//                                        rows={4}
//                                        placeholder="Describe your product..."
//                                        value={formData.description}
//                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                        required
//                                    />
//                                </Form.Group>
//
//                                <Row>
//                                    <Col md={6}>
//                                        <Form.Group className="mb-3">
//                                            <Form.Label>Price per Day (₹) *</Form.Label>
//                                            <Form.Control
//                                                type="number"
//                                                step="0.01"
//                                                min="0"
//                                                placeholder="500"
//                                                value={formData.price}
//                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                                                required
//                                            />
//                                        </Form.Group>
//                                    </Col>
//                                </Row>
//
//                                <Card className="mb-4 border-primary">
//                                    <Card.Header className="bg-primary text-white">
//                                        <h5 className="mb-0">📍 Location Information</h5>
//                                    </Card.Header>
//                                    <Card.Body>
//                                        <div className="d-flex gap-2 mb-3">
//                                            <Button
//                                                type="button"
//                                                variant="primary"
//                                                onClick={getCurrentLocation}
//                                                disabled={locationLoading}
//                                                className="flex-fill"
//                                            >
//                                                {locationLoading ? (
//                                                    <>
//                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                                                        Getting Location...
//                                                    </>
//                                                ) : (
//                                                    '📍 Get My Location'
//                                                )}
//                                            </Button>
//                                        </div>
//
//                                        <Form.Group className="mb-3">
//                                            <div className="d-flex justify-content-between align-items-center mb-2">
//                                                <Form.Label className="fw-semibold mb-0">Full Address</Form.Label>
//                                                {formData.address && (
//                                                    <Button
//                                                        type="button"
//                                                        variant="outline-info"
//                                                        size="sm"
//                                                        onClick={handleCleanAddress}
//                                                        disabled={aiLoading}
//                                                    >
//                                                        {aiLoading ? (
//                                                            <>
//                                                                <Spinner animation="border" size="sm" className="me-2" />
//                                                                Cleaning...
//                                                            </>
//                                                        ) : (
//                                                            '✨ Clean Address (AI)'
//                                                        )}
//                                                    </Button>
//                                                )}
//                                            </div>
//                                            <Form.Control
//                                                as="textarea"
//                                                rows={3}
//                                                placeholder="Full address will be auto-filled when you click 'Get My Location', or enter manually"
//                                                value={formData.address}
//                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                            />
//                                            <Form.Text className="text-muted">
//                                                Complete address (street, city, state, etc.) - Use "Clean Address (AI)" to format
//                                            </Form.Text>
//                                        </Form.Group>
//
//                                        <Form.Group className="mb-3">
//                                            <Form.Label className="fw-semibold">Location Name (Short)</Form.Label>
//                                            <Form.Control
//                                                type="text"
//                                                placeholder="e.g., Bangalore, Karnataka"
//                                                value={formData.locationName}
//                                                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
//                                            />
//                                            <Form.Text className="text-muted">
//                                                Short location identifier
//                                            </Form.Text>
//                                        </Form.Group>
//
//                                        <Row>
//                                            <Col md={6}>
//                                                <Form.Group className="mb-3">
//                                                    <Form.Label className="fw-semibold">Latitude *</Form.Label>
//                                                    <Form.Control
//                                                        type="number"
//                                                        step="0.000001"
//                                                        placeholder="12.9716"
//                                                        value={formData.latitude}
//                                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
//                                                        required
//                                                    />
//                                                </Form.Group>
//                                            </Col>
//                                            <Col md={6}>
//                                                <Form.Group className="mb-3">
//                                                    <Form.Label className="fw-semibold">Longitude *</Form.Label>
//                                                    <Form.Control
//                                                        type="number"
//                                                        step="0.000001"
//                                                        placeholder="77.5946"
//                                                        value={formData.longitude}
//                                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
//                                                        required
//                                                    />
//                                                </Form.Group>
//                                            </Col>
//                                        </Row>
//                                        <Form.Text className="text-muted">
//                                            Coordinates will be auto-filled when you click "Get My Location", or enter manually
//                                        </Form.Text>
//                                    </Card.Body>
//                                </Card>
//
//                                <Form.Group className="mb-3">
//                                    <Form.Label>
//                                        Product Images (Max 5)
//                                        {aiLoading && <span className="ms-2 text-info">🤖 AI detecting product...</span>}
//                                    </Form.Label>
//                                    <Form.Control
//                                        type="file"
//                                        accept="image/*"
//                                        multiple
//                                        onChange={handleImageChange}
//                                    />
//                                    <Form.Text className="text-muted">
//                                        Upload up to 5 images - AI will auto-detect product type from first image
//                                    </Form.Text>
//
//                                    {imagePreviews.length > 0 && (
//                                        <div className="mt-3">
//                                            <Row>
//                                                {imagePreviews.map((preview, index) => (
//                                                    <Col md={4} key={index} className="mb-2">
//                                                        <div className="position-relative">
//                                                            <img
//                                                                src={preview}
//                                                                alt={`Preview ${index + 1}`}
//                                                                className="img-thumbnail"
//                                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
//                                                            />
//                                                            <Button
//                                                                variant="danger"
//                                                                size="sm"
//                                                                className="position-absolute top-0 end-0 m-1"
//                                                                onClick={() => removeImage(index)}
//                                                            >
//                                                                ×
//                                                            </Button>
//                                                        </div>
//                                                    </Col>
//                                                ))}
//                                            </Row>
//                                        </div>
//                                    )}
//                                </Form.Group>
//
//                                <div className="d-flex gap-2">
//                                    <Button
//                                        variant="primary"
//                                        type="submit"
//                                        disabled={loading}
//                                    >
//                                        {loading ? 'Adding Product...' : 'List Product'}
//                                    </Button>
//                                    <Button
//                                        variant="outline-secondary"
//                                        type="button"
//                                        onClick={() => navigate('/')}
//                                    >
//                                        Cancel
//                                    </Button>
//                                </div>
//                            </Form>
//                        </Card.Body>
//                    </Card>
//                </Col>
//            </Row>
//        </Container>
//    );
//}
//
//export default AddProduct;
//
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useGroqAI from '../hooks/useGroqAI';

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        locationName: '',
        latitude: '',
        longitude: '',
        address: '',
        images: []
    });
    const [locationLoading, setLocationLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const getToken = () => localStorage.getItem('token');
    const { generateProductDescription, cleanAddress, detectSpam, detectProductImage } = useGroqAI();

    // Get user's current location and reverse geocode to address
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setLocationLoading(true);
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);

                    setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng
                    }));

                    // Reverse geocode using Nominatim
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                            {
                                headers: { 'User-Agent': 'RentEase App' }
                            }
                        );

                        if (response.ok) {
                            const data = await response.json();
                            const address = data.display_name || '';
                            setFormData(prev => ({
                                ...prev,
                                address,
                                locationName: address.split(',')[0] || ''
                            }));
                        } else {
                            console.warn('Failed to get address from coordinates');
                        }
                    } catch (geocodeError) {
                        console.error('Reverse geocoding error:', geocodeError);
                    } finally {
                        setLocationLoading(false);
                    }
                },
                (err) => {
                    setLocationLoading(false);
                    alert('Unable to get your location. Please enter manually.');
                    console.error(err);
                },
                {
                    enableHighAccuracy: true, // use GPS
                    maximumAge: 0,            // don't use cached position
                    timeout: 10000            // 10 seconds timeout
                }
            );
        } catch (error) {
            setLocationLoading(false);
            alert('Error getting location. Please try again.');
            console.error(error);
        }
    };

    // Handle image upload with AI detection
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const newPreviews = [];
        const newImages = [];
        let firstImageDetected = false;

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onloadend = async () => {
                        const base64 = reader.result;
                        newPreviews.push(base64);
                        newImages.push(base64);

                        if (!firstImageDetected && newPreviews.length === 1) {
                            firstImageDetected = true;
                            try {
                                setAiLoading(true);
                                const detection = await detectProductImage(base64);
                                if (detection.productName && !formData.name) {
                                    setFormData(prev => ({ ...prev, name: detection.productName }));
                                }
                            } catch (err) {
                                console.log('AI detection failed:', err);
                            } finally {
                                setAiLoading(false);
                            }
                        }

                        if (newPreviews.length === files.length) {
                            setImagePreviews([...imagePreviews, ...newPreviews]);
                            setFormData(prev => ({
                                ...prev,
                                images: [...prev.images, ...newImages]
                            }));
                        }
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    };

    // Generate product description using AI
    const handleGenerateDescription = async () => {
        if (!formData.name.trim()) {
            setError('Please enter product name first');
            return;
        }

        setAiLoading(true);
        try {
            const description = await generateProductDescription(formData.name);
            setFormData(prev => ({ ...prev, description }));
        } catch (err) {
            setError('Failed to generate description: ' + err.message);
        } finally {
            setAiLoading(false);
        }
    };

    // Clean address using AI
//    const handleCleanAddress = async () => {
//        if (!formData.address.trim()) {
//            setError('Please get location or enter address first');
//            return;
//        }
//
//        setAiLoading(true);
//        try {
//            const cleaned = await cleanAddress(formData.address);
//            setFormData(prev => ({ ...prev, address: cleaned }));
//        } catch (err) {
//            setError('Failed to clean address: ' + err.message);
//        } finally {
//            setAiLoading(false);
//        }
//    };
// Clean address using AI reliably
const handleCleanAddress = async () => {
    if (!formData.address.trim()) {
        setError('Please get location or enter address first');
        return;
    }

    setAiLoading(true);
    setError('');
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/ai/clean-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // include JWT if needed
            },
            body: JSON.stringify({ address: formData.address }),
        });

        if (!response.ok) throw new Error('Failed to clean address');

        const data = await response.json();
        if (!data.cleanedAddress) throw new Error('No cleaned address returned');

        setFormData(prev => ({
            ...prev,
            address: data.cleanedAddress,
            locationName: data.cleanedAddress.split(',')[0] || prev.locationName
        }));
    } catch (err) {
        console.error('Clean address failed:', err);
        setError('Failed to clean address. Please try manually.');
    } finally {
        setAiLoading(false);
    }
};



    const removeImage = (index) => {
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        const newImages = formData.images.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    // Submit product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.description || !formData.price) {
            setError('Please fill in all required fields');
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setError('Please provide location (use "Get My Location" or enter manually)');
            return;
        }

        setAiLoading(true);
        try {
            const spamText = `${formData.name} ${formData.description}`;
            const isSpam = await detectSpam(spamText);
            if (isSpam) {
                setError('Content contains inappropriate or spam content. Please revise your product details.');
                setAiLoading(false);
                return;
            }
        } catch (err) {
            console.warn('Spam detection failed, proceeding anyway:', err);
        } finally {
            setAiLoading(false);
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    locationName: formData.locationName || formData.address || '',
                    images: formData.images
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to add product';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorData || errorMessage;
                } catch (e) {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            alert('Product added successfully!');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to add product. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4 mb-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h3 className="mb-0">List Your Product for Rent</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., Canon DSLR Camera"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Describe your product..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price per Day (₹) *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="500"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Card className="mb-4 border-primary">
                                    <Card.Header className="bg-primary text-white">
                                        <h5 className="mb-0">📍 Location Information</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex gap-2 mb-3">
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={getCurrentLocation}
                                                disabled={locationLoading}
                                                className="flex-fill"
                                            >
                                                {locationLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        Getting Location...
                                                    </>
                                                ) : (
                                                    '📍 Get My Location'
                                                )}
                                            </Button>
                                        </div>

                                        <Form.Group className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <Form.Label className="fw-semibold mb-0">Full Address</Form.Label>
                                                {formData.address && (
                                                    <Button
                                                        type="button"
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={handleCleanAddress}
                                                        disabled={aiLoading}
                                                    >
                                                        {aiLoading ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                Cleaning...
                                                            </>
                                                        ) : (
                                                            '✨ Clean Address (AI)'
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Full address will be auto-filled when you click 'Get My Location', or enter manually"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                            <Form.Text className="text-muted">
                                                Complete address (street, city, state, etc.) - Use "Clean Address (AI)" to format
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Location Name (Short)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g., Bangalore, Karnataka"
                                                value={formData.locationName}
                                                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                                            />
                                            <Form.Text className="text-muted">
                                                Short location identifier
                                            </Form.Text>
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-semibold">Latitude *</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="12.9716"
                                                        value={formData.latitude}
                                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-semibold">Longitude *</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.000001"
                                                        placeholder="77.5946"
                                                        value={formData.longitude}
                                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Text className="text-muted">
                                            Coordinates will be auto-filled when you click "Get My Location", or enter manually
                                        </Form.Text>
                                    </Card.Body>
                                </Card>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Product Images (Max 5)
                                        {aiLoading && <span className="ms-2 text-info">🤖 AI detecting product...</span>}
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Upload up to 5 images - AI will auto-detect product type from first image
                                    </Form.Text>

                                    {imagePreviews.length > 0 && (
                                        <div className="mt-3">
                                            <Row>
                                                {imagePreviews.map((preview, index) => (
                                                    <Col md={4} key={index} className="mb-2">
                                                        <div className="position-relative">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="img-thumbnail"
                                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                            />
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="position-absolute top-0 end-0 m-1"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding Product...' : 'List Product'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={() => navigate('/')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AddProduct;
