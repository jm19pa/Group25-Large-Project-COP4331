// components/EmailVerification.tsx

import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from './Path';
import './register.css'; // Keep or move styles as needed

// const app_name = 'pocketprofessors.com';

// function buildPath(route: string): string {
//   return process.env.NODE_ENV !== 'development'
//     ? 'http://' + app_name + ':5000/' + route
//     : 'http://localhost:5000/' + route;
// }

const EmailVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();


  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    const obj = { email, code };

    try {
      const response = await fetch(buildPath('api/verify'), {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (res.success) {
        alert('Email verified successfully!');
        navigate('/login');
      } else {
        alert('Verification failed: ' + res.error);
      }
    } catch (error: any) {
      alert('An error occurred: ' + error.message);
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
            required
          />
        </div>
        <button type="submit" className="buttons" onClick={() => setEmail(email)}>Set Email</button>
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" className="buttons">Verify Email</button>
      </form>
    </div>
  );
};

export default EmailVerification;
