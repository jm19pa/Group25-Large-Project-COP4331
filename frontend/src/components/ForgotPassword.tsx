import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from './Path';
import './register.css'; // Style it however you prefer

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const obj = {
            email: email,
            newpassword: newPassword,
            verificationCode: verificationCode
        };

        try {
            const response = await fetch(buildPath('/api/updatePassword'), {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (res.success) {
                setMessage('Password updated successfully!');
                setIsError(false);
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
            } else {
                setMessage(res.error || 'Something went wrong');
                setIsError(true);
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error');
            setIsError(true);
        }
    };

    return (
        <div className="center-screen">
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">Reset Your Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                />

                <input
                    type="text"
                    placeholder="Verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    className="input-field"
                />

                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="input-field"
                />

                <button type="submit" className="submit-button">
                    Update Password
                </button>

                {message && (
                    <div className={`message ${isError ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;
