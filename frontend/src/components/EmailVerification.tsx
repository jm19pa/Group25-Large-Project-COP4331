// components/EmailVerification.tsx

import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from './Path';
import './register.css';

// const app_name = 'pocketprofessors.com';

// function buildPath(route: string): string {
//   return process.env.NODE_ENV !== 'development'
//     ? 'http://' + app_name + ':5000/' + route
//     : 'http://localhost:5000/' + route;
// }

const EmailVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setCode] = useState('');
  const navigate = useNavigate();


  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    const obj = { email, verificationCode };

    try {
      const response = await fetch(buildPath('api/Confirm'), {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (res.success) {
        // alert('Email verified successfully!');
        navigate('/login');
      } else {
        // alert('Verification failed: ' + res.error);
      }
    } catch (error: any) {
    //   alert('An error occurred: ' + error.message);
    }
  }

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
    //   alert('An error occurred: ' + error.message);
    }
  }

  return (
    <div className="container">
      <h1>Verify your Email</h1>
      <p>Re-enter your email for verification</p>
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
        <button type="submit" className="buttons" onClick={handleSendCode}>Send Code </button>
      <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
      <form onSubmit={handleVerify}>
        <div className="input_div">
           <label className="text" id='verification'>Verification Code</label>
          <input
            className="input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="######"
            value={verificationCode}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" className="buttons" onClick={handleVerify}>Verify Email</button>
      </form>
    </div>
  );
};

export default EmailVerification;
