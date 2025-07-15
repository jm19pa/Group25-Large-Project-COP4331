import React, { useState } from 'react';
import './register.css'
// import { build } from 'vite';
import { buildPath } from './Path';
import { storeToken , retrieveToken } from '../tokenStorage';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


// this may need to change due to merging login/signup
// function showPassword(): void{
//   const passwordField = document.getElementById('password') as HTMLInputElement;
//   if(passwordField.type === 'password'){
//     passwordField.type = 'text';
//   }
//   else{
//     passwordField.type = 'password';
//   }
// }
type DecodedToken = {
  userId: number;
  firstName: string;
  lastName: string;
};

const Register: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);
   const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');


async function doLogin(event: any): Promise<void> {
  event.preventDefault();

  const obj = { login: login, password: password };
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
      postMessage('User/Password combination incorrect');
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
      postMessage('User/Password combination incorrect');
    } else {
      const user = { firstName, lastName, id: userId };
      localStorage.setItem('user_data', JSON.stringify(user));
      postMessage('');
      navigate('/cards');
    }

  } catch (error: any) {
    alert(error.toString());
  }
}
  async function doRegister(event:any): Promise<void>{
    event.preventDefault();
	  //var obj = {login:login,firstName:firstName,lastName:lastName,password:password};
    let obj = {login:login, firstName:firstName, lastName:lastName, password:password, email:email};
    let js = JSON.stringify(obj);

    try{
      const response = await fetch(buildPath('api/register'),
      {method:'POST', body:js, headers:{'Content-Type':'application/json'}});

      let res = JSON.parse(await response.text());

      if (res.error) alert('Error: ' + res.Error);
      else{
        let user = {firstName:res.firstName, lastName:res.lastName, id:res.id}
        localStorage.setItem('user_data', JSON.stringify(user));
        window.location.href = '/login';
      }
    }
    catch(error:any){
      alert(error.toString());
      return;
    }
  }

  const toggleForm = () => {
    setShowSignup(prev => !prev);
  };

  return (
    <div className="container">
      <h1>WELCOME</h1>

      <label className="switch">
        <input
          type="checkbox"
          checked={showSignup}
          onChange={toggleForm}
          className="toggle_checkbox"
        />
        <div className="slider">
          <span className="login_switch">Login</span>
          <span className="signup_switch">Signup</span>
        </div>
      </label>

    {showSignup ? (
      <form className="signup_input" onSubmit={doRegister}>

        <h3>Create an account</h3>
        
        <div className="input_div">
          <label className="text">Username</label>
          <input className="input" id="login" type="text" placeholder="Create your username" value={login} onChange={((e) => setLogin(e.target.value))}/>
        </div>

        <div className="input_div">
          <label className="text">Password</label>
          <input className="input" id="password" type="text" placeholder="Create your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          {/* <img
            src="/images/eyeCrossed.png"
            alt="Toggle Password Visibility"
            height="20"
            width="20"
            onClick={showPassword}
            style={{cursor: "pointer"}} // can change to css
          /> */}
        </div>

          <div className="input_div">
          <label className="text">Email</label>
           {/* <input className="input" id="email" type="text" placeholder="Enter your Email"/>*/}
         <input className="input" id="email" type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}/> 
        </div>
        
        <div className="input_div">
          <label className="text">First Name</label>
          <input className="input" id="first_name" type="text" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </div>

        <div className="input_div">
          <label className="text">Last Name</label>
          <input className="input" id="last_name" type="text" placeholder="Enter your last name"  value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </div>

        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Submit"
          onClick={doRegister}
        />
      </form>
    ) : (
      <div className="login_page">

        <h3>Login to existing account</h3>
        
        <div className="input_div">
          <label className="text">Username</label>
          <input className="input" id="username" type="text" placeholder="Enter your username" value={login} onChange={((e) => setLogin(e.target.value))}/>
        </div>

        <div className="input_div">
          <label className="text">Password</label>
          <input className="input" id="password" type="text" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Submit"
          onClick={doLogin}
        />
      </div>
    )}
	</div>
)

}
export default Register;
