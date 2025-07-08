import React, { useState } from 'react';
import './register.css'

const app_name = 'pocketprofessors.com';

function buildPath(route:string) : string {
  if(process.env.NODE_ENV != 'development'){
    return 'http://' + app_name + ':5000/' + route;
  }
  else{
    return 'http://localhost:5000' + route;
  }
}

const Register: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const goToLoginPage = () => {
    window.location.href = '/login';
  };

  async function doRegister(event:any): Promise<void>{
    event.preventDefault();
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
          <input className="input" id="login" type="text" placeholder="Create your username"/>
        </div>

        <div className="input_div">
          <label className="text">Password</label>
          <input className="input" id="password" type="text" placeholder="Create your password"/>
        </div>

          <div className="input_div">
          <label className="text">Email</label>
          <input className="input" id="email" type="text" placeholder="Enter your Email"/>
        </div>
        
        <div className="input_div">
          <label className="text">First Name</label>
          <input className="input" id="first_name" type="text" placeholder="Enter your first name"/>
        </div>

        <div className="input_div">
          <label className="text">Last Name</label>
          <input className="input" id="last_name" type="text" placeholder="Enter your last name"/>
        </div>

        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Submit"
          // onClick={doLogin}
        />

        {/* <label className="label">Login: </label>
        <input
          placeholder="Username"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <label>First Name: </label>
        <input
          placeholder="First Name"
          type="text"
          id="first_name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Password: </label>
        <input
          placeholder="Password"
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Last Name: </label>
        <input
          placeholder="Last Name"
          type="text"
          id="last_name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        /> */}
      </form>
    ) : (
      <div className="login_page">

        <h3>Login to existing account</h3>
        
        <div className="input_div">
          <label className="text">Username</label>
          <input className="input" id="username" type="text" placeholder="Enter your username"/>
        </div>

        <div className="input_div">
          <label className="text">Password</label>
          <input className="input" id="password" type="text" placeholder="Enter your password"/>
        </div>

        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Submit"
          // onClick={doLogin}
        />
      </div>
    )}
	</div>
)

}
export default Register;
