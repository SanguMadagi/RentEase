// src/pages/VerifyOtp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation();

    // ✅ Use state or sessionStorage
    const email = state?.email || sessionStorage.getItem('otpEmail');
    const name = state?.name || sessionStorage.getItem('otpName');
    const purpose = state?.purpose || sessionStorage.getItem('otpPurpose') || 'REGISTER';

    useEffect(() => {
        if (!email) navigate('/register', { replace: true });
    }, [email, navigate]);

    const handleVerify = async () => {
        if (!otp || otp.length < 4) {
            alert('Enter a valid OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, purpose })
            });
            const data = await response.json();

            if (!response.ok || !data.verified) {
                alert(data.message || 'Invalid or expired OTP');
                return;
            }

            // ✅ Registration → go to set password
           if (purpose === "REGISTER") {
             navigate("/set-password", { state: { email, name } }); // move to password step
             return;
           }


            // ✅ Login → store token
//             if (purpose === 'LOGIN') {
//                 authService.setToken(data.token);
//                 navigate('/', { replace: true });
//             }
 if (purpose === 'LOGIN') {
    if (!data.token) throw new Error('No token received from server');
    login(data.token);
    navigate('/', { replace: true });
}
        } catch (err) {
            alert(err.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
            alert('OTP resent successfully');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Verify OTP</h2>
            <p>OTP sent to: {email || 'N/A'}</p>

            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />

            <div className="mt-2">
                <button onClick={handleVerify} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button onClick={handleResendOtp} disabled={loading} style={{ marginLeft: '10px' }}>
                    {loading ? 'Resending...' : 'Resend OTP'}
                </button>
            </div>
        </div>
    );
}

export default VerifyOtp;
