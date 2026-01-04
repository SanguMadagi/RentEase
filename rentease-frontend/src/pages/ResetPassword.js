import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        if (!email) navigate('/forgot-password', { replace: true });
    }, [email, navigate]);

    if (!email) return null;

const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        setLoading(false);
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword: password, purpose: "FORGOT" }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Password reset failed');

        // Option 1: If backend returns a token, log in automatically
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Password reset successful! Logging you in...');
            navigate('/');
        } else {
            // Option 2: Backend only returns success, navigate to login
            alert('Password reset successful! Please login.');
            navigate('/login');
        }
    } catch (err) {
        setError(err.message || 'Failed to reset password. Please try again.');
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
                                <h2 className="fw-bold text-primary mb-2">Reset Password</h2>
                                <p className="text-muted">Enter the OTP and your new password</p>
                            </div>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleReset}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">OTP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        required
                                        className="py-2 text-center"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-2 fw-semibold"
                                    disabled={loading || otp.length !== 6 || !password}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default ResetPassword;
