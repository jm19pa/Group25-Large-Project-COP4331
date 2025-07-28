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

    
    async function handleSendCode(event: React.MouseEvent) {
    event.preventDefault();
    const obj = { email };

    try {
        const response = await fetch(buildPath('api/Verify'), {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' },
        });

        const res = await response.json();

        if (res.success) {
        alert('Verification code sent to ' + email);
        } else {
        alert('Failed to send code: ' + res.error);
        }
    } catch (error: any) {
        alert('An error occurred: ' + error.message);
    }
    }

    return (
        <div className="container">
            <h1>Forgot your password?</h1>

            <p>Enter your email here</p>
            <div className="input_div">
                <label className="text" id='email'>Email</label>
                <input
                    className="input"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="buttons" onClick={handleSendCode}>Send Code</button>
            <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
            <form onSubmit={handleSubmit}>
                <div className='input_div'>
                    <label className='text' id='verification'>Verification Code</label>
                    <input
                        className='input'
                        type='text'
                        inputMode='numeric'
                        pattern='[0-9]{6}'
                        maxLength={6}
                        placeholder='######'
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </div>

                <div className='input_div'>
                    <label className='text' id='verification'>New Password</label>
                    <input
                        className='input'
                        type='password'
                        placeholder='Create new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="buttons" onClick={handleSubmit}>
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
