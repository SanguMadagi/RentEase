import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose:'FORGOT' }),
            });

            let data;
            try {
                data = await response.json();
            } catch {
                const text = await response.text();
                throw new Error(text || 'Failed to send OTP');
            }

            if (!response.ok) throw new Error(data.message || data || 'Failed to send OTP');

            navigate('/reset-password', { state: { email } });
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
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
                                <h2 className="fw-bold text-primary mb-2">Forgot Password</h2>
                                <p className="text-muted">Enter your email to receive a reset OTP</p>
                            </div>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}

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
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default ForgotPassword;
