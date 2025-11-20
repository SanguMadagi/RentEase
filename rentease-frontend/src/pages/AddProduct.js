import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function AddProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

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
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        if (!isEditMode) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                });
                if (!res.ok) throw new Error('Failed to fetch product');
                const data = await res.json();
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || '',
                    locationName: data.locationName || '',
                    latitude: data.latitude || '',
                    longitude: data.longitude || '',
                    address: data.address || '',
                    images: data.images || []
                });
                setImagePreviews(data.images || []);
            } catch (err) {
                setError(err.message || 'Failed to load product for editing');
            }
        };

        fetchProduct();
    }, [id]);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                        headers: { 'User-Agent': 'RentEase App' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setFormData(prev => ({
                            ...prev,
                            address: data.display_name || '',
                            locationName: data.display_name.split(',')[0] || ''
                        }));
                    }
                } catch (err) {
                    console.error('Reverse geocoding failed', err);
                } finally {
                    setLocationLoading(false);
                }
            },
            () => { setLocationLoading(false); alert('Unable to get location'); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const newImages = [];
        const newPreviews = [];

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                await new Promise(resolve => {
                    reader.onloadend = () => {
                        newPreviews.push(reader.result);
                        newImages.push(reader.result);
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

        setImagePreviews(prev => [...prev, ...newPreviews]);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.description || !formData.price || !formData.latitude || !formData.longitude) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    locationName: formData.locationName || formData.address || '',
                    address: formData.address,
                    images: formData.images
                })
            });

            if (!res.ok) {
                const msg = (await res.json()).message || (isEditMode ? 'Failed to update product' : 'Failed to add product');
                throw new Error(msg);
            }

            alert(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate('/profile');
        } catch (err) {
            setError(err.message);
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
                            <h3>{isEditMode ? 'Edit Product' : 'List Your Product for Rent'}</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name *</Form.Label>
                                    <Form.Control type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control as="textarea" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Price per Day (₹) *</Form.Label>
                                    <Form.Control type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                </Form.Group>

                                <Card className="mb-3 border-primary">
                                    <Card.Header className="bg-primary text-white">📍 Location</Card.Header>
                                    <Card.Body>
                                        {/* ✅ Get My Location button clearly visible */}
                                        <Button variant="primary" onClick={getCurrentLocation} disabled={locationLoading} className="mb-3 w-100">
                                            {locationLoading ? <><Spinner animation="border" size="sm" className="me-2"/> Getting Location...</> : '📍 Get My Location'}
                                        </Button>

                                        <Form.Group className="mb-2">
                                            <Form.Label>Full Address</Form.Label>
                                            <Form.Control as="textarea" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                                        </Form.Group>

                                        <Form.Group className="mb-2">
                                            <Form.Label>Location Name</Form.Label>
                                            <Form.Control type="text" value={formData.locationName} onChange={e => setFormData({...formData, locationName: e.target.value})} />
                                        </Form.Group>

                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Latitude *</Form.Label>
                                                    <Form.Control type="number" step="0.000001" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} required />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Longitude *</Form.Label>
                                                    <Form.Control type="number" step="0.000001" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Form.Group className="mb-3">
                                    <Form.Label>Product Images (Max 5)</Form.Label>
                                    <Form.Control type="file" accept="image/*" multiple onChange={handleImageChange} />
                                    {imagePreviews.length > 0 && (
                                        <Row className="mt-2">
                                            {imagePreviews.map((img, i) => (
                                                <Col md={4} key={i} className="mb-2 position-relative">
                                                    <img src={img} alt={`Preview ${i+1}`} className="img-thumbnail" style={{width:'100%', height:'150px', objectFit:'cover'}} />
                                                    <Button size="sm" variant="danger" className="position-absolute top-0 end-0 m-1" onClick={() => removeImage(i)}>×</Button>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="primary" disabled={loading}>
                                        {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Product' : 'List Product')}
                                    </Button>
                                    <Button variant="outline-secondary" type="button" onClick={() => navigate('/profile')}>Cancel</Button>
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

