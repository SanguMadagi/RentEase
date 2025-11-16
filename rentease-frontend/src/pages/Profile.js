import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        profilePicture: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setUser(data);
            setFormData({
                username: data.username || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
                profilePicture: data.profilePicture || ''
            });
        } catch (err) {
            setError('Failed to load profile. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully!');
            setEditMode(false);
            fetchProfile(); // Refresh profile data
        } catch (err) {
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Failed to load profile</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4 mb-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    {formData.profilePicture ? (
                                        <img
                                            src={formData.profilePicture}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #0d6efd' }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                backgroundColor: '#0d6efd',
                                                color: 'white',
                                                fontSize: '3rem',
                                                border: '4px solid #0d6efd'
                                            }}
                                        >
                                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                </div>
                                <h2 className="fw-bold text-primary mb-2">{user.username || 'User'}</h2>
                                <Badge bg={user.aadhaarVerified ? "success" : "warning"} className="px-3 py-2">
                                    {user.aadhaarVerified ? "✓ Aadhaar Verified" : "⚠ Aadhaar Not Verified"}
                                </Badge>
                            </div>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                                    {success}
                                </Alert>
                            )}

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0">Profile Information</h4>
                                {!editMode && (
                                    <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                                        ✏️ Edit Profile
                                    </Button>
                                )}
                            </div>

                            <Form>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            className="py-2"
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-semibold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="py-2 bg-light"
                                        />
                                        <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="+91 9876543210"
                                            className="py-2"
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-semibold">Profile Picture</Form.Label>
                                        {editMode ? (
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="py-2"
                                            />
                                        ) : (
                                            <Form.Control
                                                type="text"
                                                value={formData.profilePicture ? "Image uploaded" : "No image"}
                                                disabled
                                                className="py-2 bg-light"
                                            />
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Form.Label className="fw-semibold">Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="Enter your address"
                                            className="py-2"
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4} className="mb-3">
                                        <Form.Label className="fw-semibold">City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="City"
                                            className="py-2"
                                        />
                                    </Col>
                                    <Col md={4} className="mb-3">
                                        <Form.Label className="fw-semibold">State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="State"
                                            className="py-2"
                                        />
                                    </Col>
                                    <Col md={4} className="mb-3">
                                        <Form.Label className="fw-semibold">Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            placeholder="123456"
                                            className="py-2"
                                        />
                                    </Col>
                                </Row>

                                {editMode && (
                                    <div className="d-flex gap-2 mt-4">
                                        <Button
                                            variant="primary"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-4"
                                        >
                                            {saving ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Saving...
                                                </>
                                            ) : (
                                                '💾 Save Changes'
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setEditMode(false);
                                                fetchProfile(); // Reset form data
                                            }}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </Form>

                            {!user.aadhaarVerified && (
                                <Card className="mt-4 border-warning">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="text-warning mb-1">⚠️ Aadhaar Verification Required</h5>
                                                <p className="text-muted mb-0">
                                                    Verify your Aadhaar to book products and access all features.
                                                </p>
                                            </div>
                                            <Button
                                                variant="warning"
                                                onClick={() => navigate('/verify-aadhaar')}
                                            >
                                                Verify Now
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;

