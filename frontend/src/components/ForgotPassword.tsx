import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from './Path';
import './register.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    // const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const passwordComplexity = (value: string, labelId: string, inputId: string): boolean => {
        const label = document.getElementById(labelId);
        const input = document.getElementById(inputId);

        if (!label || !input) return false;

        label.classList.remove("label_error");
        input.classList.remove("input_error");

        const string_length = value.length;

        if (string_length < 8) {
            label.classList.add("label_error")
            input.classList.add("input_error")
            // console.log("Make sure password is 8 to 20 characters")
            return false;
        }

        if (string_length > 20) {
            label.classList.add("label_error")
            input.classList.add("input_error")
            // console.log("Make sure password is 8 to 20 characters")
            return false;
        }

        const special_characters = ['!', '@', '#', '$', '%', '&', '*', '(', ')'];
        const contains_special_character = special_characters.some(char => value.includes(char));

        if (!contains_special_character) {
            label.classList.add("label_error")
            input.classList.add("input_error")
            // console.log("Make sure password contains a special character, ex: !, @, &")
            return false
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {

        if (!passwordComplexity) return;

        e.preventDefault();

        const obj = {
            email: email,
            newpassword: newPassword,
            verificationCode: verificationCode
        };

        try {
            const response = await fetch(buildPath('api/updatePassword'), {
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
                // alert('Verification code sent to ' + email);
            } else {
                // alert('Failed to send code: ' + res.error);
            }
        } catch (error: any) {
            // alert('An error occurred: ' + error.message);
        }
    }

    // const togglePasswordVisibility = () => {
    //     setShowPassword(prev => !prev);
    // };

    return (
        <div className="container">
            <h1>Forgot your password?</h1>
            <form onSubmit={handleSubmit}>

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
                <div className="input_div">
                    <label className="text" id='verification'>Verification Code</label>
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
                        // type={showPassword ? "text" : "password"}
                        type={"password"}
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
