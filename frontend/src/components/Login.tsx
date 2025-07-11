import React, { useState } from 'react';
import { buildPath } from './Path';
import { storeToken } from '../tokenStorage';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  userId: number;
  firstName: string;
  lastName: string;
};

function Login()
{
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
async function doLogin(event:any) : Promise<void>
{
event.preventDefault();
const obj = { login: loginName, password: loginPassword };
const js = JSON.stringify(obj);
try
{
const response = await fetch(buildPath('api/login'),{
    method:'POST',
    body:js,
    headers:{'Content-Type':'application/json'}
});
const res = JSON.parse(await response.text());
if(res.accessToken == null) {
    setMessage('User/Password combination incorrect');
    return;
}

storeToken(res);

const decoded = jwtDecode<DecodedToken>(res.accessToken);
      const user = {
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        id: decoded.userId,
      };

      localStorage.setItem('user_data', JSON.stringify(user));
      setMessage('');
      window.location.href = '/cards';
    } catch (error: any) {
      alert(error.toString());
    }
};
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