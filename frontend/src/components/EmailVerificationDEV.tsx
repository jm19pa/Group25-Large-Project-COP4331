// components/EmailVerificationDEV.tsx

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { buildPath } from './Path';
import './register.css'; // Keep or move styles as needed

// const app_name = 'pocketprofessors.com';

// function buildPath(route: string): string {
//   return process.env.NODE_ENV !== 'development'
//     ? 'http://' + app_name + ':5000/' + route
//     : 'http://localhost:5000/' + route;
// }

const EmailVerificationDEV: React.FC = () => {
//   const [code, setCode] = useState('');

  return (
    <div className="container">
      <h1>Verify your Email</h1>
      <p>Enter the 6-digit code sent to <strong>email</strong></p>
        <div className="input_div">
          <label className="text">Verification Code</label>
          <input
            className="input"
            type="text"
            placeholder="######"
            // value={code}
            // onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="buttons">Verify Email</button>
    </div>
  );
};

export default EmailVerificationDEV;
