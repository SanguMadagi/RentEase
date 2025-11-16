import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OtpVerification() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { email, purpose, name } = location.state || {};

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    // Redirect if no email/purpose in state (use useEffect to avoid render issues)
    useEffect(() => {
        if (!email || !purpose) {
            navigate(purpose === 'REGISTER' ? '/register' : '/login', { replace: true });
        }
    }, [email, purpose, navigate]);

    // Don't render if missing required data
    if (!email || !purpose) {
        return null;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                    purpose,
                    name: purpose === 'REGISTER' ? name : undefined,
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                const text = await response.text();
                throw new Error(text || 'OTP verification failed');
            }

            if (!response.ok) {
                const errorMessage = data.userMessage || data.message || data || 'OTP verification failed';
                throw new Error(errorMessage);
            }

            // Login using AuthContext
            if (data.token) {
                login(data.token);
                // Redirect to home
                navigate('/');
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, purpose }),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                const text = await response.text();
                throw new Error(text || 'Failed to resend OTP');
            }

            if (!response.ok) {
                throw new Error(data.message || data || 'Failed to resend OTP');
            }

            alert('OTP resent successfully!');
        } catch (err) {
            setError(err.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <h2 className="fw-bold text-primary mb-2">Verify OTP</h2>
                                <p className="text-muted mb-0">
                                    We've sent a 6-digit OTP to
                                </p>
                                <p className="text-dark fw-semibold mt-1">
                                    {email}
                                </p>
                            </div>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleVerify}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Enter OTP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtp(value);
                                        }}
                                        maxLength={6}
                                        required
                                        className="text-center py-3"
                                        style={{ fontSize: '1.8rem', letterSpacing: '0.8rem', fontWeight: 'bold' }}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter the 6-digit code sent to your email
                                    </Form.Text>
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 mb-3 py-2 fw-semibold"
                                    disabled={loading || otp.length !== 6}
                                    size="lg"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                            </Form>

                            <div className="text-center mb-3">
                                <p className="mb-2 text-muted">Didn't receive the OTP?</p>
                                <Button 
                                    variant="link" 
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="text-primary fw-semibold text-decoration-none"
                                >
                                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                                </Button>
                            </div>

                            <div className="text-center mt-4">
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => navigate(purpose === 'REGISTER' ? '/register' : '/login')}
                                >
                                    ← Back
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default OtpVerification;

