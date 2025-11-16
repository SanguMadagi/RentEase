import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('error')) {
            setError(params.get('error'));
        }
    }, [location.search]);

    const handleGoogleLogin = () => {
        // Force account selection by adding prompt=select_account
        // This ensures users always see the account chooser
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google?prompt=select_account`;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    purpose: 'LOGIN'
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                // If response is not JSON, get text
                const text = await response.text();
                throw new Error(text || 'Failed to send OTP');
            }

            if (!response.ok) {
                throw new Error(data.message || data || 'Failed to send OTP');
            }

            // Navigate to OTP verification page
            navigate('/verify-otp', {
                state: { email, purpose: 'LOGIN' }
            });
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary mb-2">Login to RentEase</h2>
                                <p className="text-muted">
                                    Enter your email to receive an OTP
                                </p>
                            </div>
                            
                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                variant="outline-primary"
                                className="w-100 mb-4 py-2 fw-semibold"
                                type="button"
                                onClick={handleGoogleLogin}
                                style={{ 
                                    fontSize: '1rem',
                                    borderColor: '#4285F4',
                                    color: '#4285F4'
                                }}
                            >
                                <svg width="20" height="20" className="me-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="text-center mb-4">
                                <span className="text-muted">or</span>
                            </div>
                            
                            <Form onSubmit={handleSendOtp}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 mb-3 py-2 fw-semibold"
                                    disabled={loading}
                                    size="lg"
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="mb-0 text-muted">
                                    Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Register here</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default Login;
