import React, { useState } from 'react';
import { buildPath } from './Path';
import { storeToken , retrieveToken } from '../tokenStorage';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
type DecodedToken = {
  userId: number;
  firstName: string;
  lastName: string;
};

function Login()
{   const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loginName, setLoginName] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');
function handleSetLoginName(e: any): void
    {
        setLoginName(e.target.value);
    }

    function handleSetPassword(e: any): void
    {
        setPassword(e.target.value);
    }

// doLogin    
async function doLogin(event: any): Promise<void> {
  event.preventDefault();

  const obj = { login: loginName, password: loginPassword };
  const js = JSON.stringify(obj);

  try {
    const response = await fetch(buildPath('api/login'), {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' }
    });

    const res = JSON.parse(await response.text());

    console.log("🟢 Login response:", res);

    const jwtToken = res.jwtToken;
    if (!jwtToken) {
      console.log("❌ No jwtToken in response.");
      setMessage('User/Password combination incorrect');
      return;
    }

    // Store token as a simple string, NOT as an object
    storeToken(jwtToken);
    console.log("✅ Stored token:", jwtToken);
    console.log("🔍 Immediately after storing:", retrieveToken());

    const decoded = jwtDecode<DecodedToken>(jwtToken);
    const userId = decoded.userId;
    const firstName = decoded.firstName;
    const lastName = decoded.lastName;

    if (userId <= 0) {
      setMessage('User/Password combination incorrect');
    } else {
      const user = { firstName, lastName, id: userId };
      localStorage.setItem('user_data', JSON.stringify(user));
      setMessage('');
      navigate('/cards');
    }

  } catch (error: any) {
    alert(error.toString());
  }
}


    function goToRegisterPage(): void{
        window.location.href = '/register';
    };


    function showPassword(): void {
        const passwordField = document.getElementById('loginPassword') as HTMLInputElement;
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    };

    /* <img
                src={isChecked ? '/images/eyeCrossed.png' : '/images/eyeCrossed.png'}
                alt="Toggle password visibility"
                height="20"
                width="20"
            /> */

    return(
        <div id="loginDiv">
            <span id="inner-title">PLEASE LOG IN</span><br />
            Login: <input
                type="text"
                id="loginName"
                placeholder="Username"
                onChange={handleSetLoginName}
            /><br />
            Password: <input
                type="password"
                id="loginPassword"
                placeholder="Password"
                onChange={handleSetPassword}
            />
            <img
                src="/images/eyeCrossed.png"
                alt="Toggle password visibility"
                height="18"
                width="18"
                onClick={showPassword}
                style={{ cursor: "pointer" }}
            />
            <br/>
            <input
                type="submit"
                id="loginButton"
                className="buttons"
                value="Do It"
                onClick={doLogin}
            />
            <span id="loginResult">Output: {message}</span>
            <br/>
            <br/>
            <h5>Don't have an account?</h5>
            <button type="button" id="Register" className="buttons"
                onClick={goToRegisterPage}> Register </button>

            <br/>
            
        </div>
    );
};

export default Login;