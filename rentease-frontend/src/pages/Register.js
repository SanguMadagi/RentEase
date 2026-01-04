// src/pages/Register.jsx
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: 'REGISTER' })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

            // ✅ Save in sessionStorage so refresh doesn't break flow
            sessionStorage.setItem('otpEmail', email);
            sessionStorage.setItem('otpName', name);
            sessionStorage.setItem('otpPurpose', 'REGISTER');

            navigate('/verify-otp', { state: { email, name, purpose: 'REGISTER' } });
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary mb-2">Join RentEase</h2>
                                <p className="text-muted">Start renting and lending products in your neighborhood</p>
                            </div>

                            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

                            <Form onSubmit={handleSendOtp}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Form.Text className="text-muted">We will send a verification OTP</Form.Text>
                                </Form.Group>

                                <Button type="submit" className="w-100 py-2" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">
                                    Already have an account? <Link to="/login">Login</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default Register;



