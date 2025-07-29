import React, { useState } from 'react';
import './register.css'
// import { build } from 'vite';
import { buildPath } from './Path';
import { storeToken } from '../tokenStorage';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

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
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const checkBlank = (value: string, labelId: string, inputId: string): boolean => {
        const label = document.getElementById(labelId);
        const input = document.getElementById(inputId);

        if (!label || !input) return false;

        label.classList.remove("label_error");
        input.classList.remove("input_error");

        if (value.trim() === '') {
            setError("Fill out the forms in red marked by *")
            label.classList.add("label_error")
            input.classList.add("input_error")
            return true;
        }
        return false;
    };

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
            setError("Make sure password is 8 to 20 characters")
            return false;
        }

        if (string_length > 20) {
            label.classList.add("label_error")
            input.classList.add("input_error")
            setError("Make sure password is 8 to 20 characters")
            return false;
        }

        const special_characters = ['!', '@', '#', '$', '%', '&', '*', '(', ')'];
        const contains_special_character = special_characters.some(char => value.includes(char));

        if (!contains_special_character) {
            label.classList.add("label_error")
            input.classList.add("input_error")
            setError("Make sure password contains a special character, ex: !, @, &")
            return false
        }

        return true;
    }


    async function doLogin(event: any): Promise<void> {
        event.preventDefault();
        setError("");

        let isBlank = false;

        if (checkBlank(login, "username_label", "username")) isBlank = true;
        if (checkBlank(password, "password_label", "password")) isBlank = true;

        if (isBlank) return;

        const obj = { login: login, password: password };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = JSON.parse(await response.text());

            // console.log("Login response:", res);

            const jwtToken = res.jwtToken;
            if (!jwtToken) {
                // console.log("No jwtToken in response.");
                postMessage('User/Password combination incorrect');
                return;
            }

            // Store token as a simple string, NOT as an object
            storeToken(jwtToken);
            // console.log("Stored token:", jwtToken);
            // console.log("Immediately after storing:", retrieveToken());

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
                navigate('/pack');
            }

        } catch (error: any) {
            alert(error.toString());
        }
    }
    async function doRegister(event: any): Promise<void> {
        event.preventDefault();
        setError("");

        let isBlank = false;

        if (checkBlank(login, "username_label", "login")) isBlank = true;
        if (checkBlank(password, "password_label", "password")) isBlank = true;
        if (checkBlank(email, "email_label", "email")) isBlank = true;
        if (checkBlank(firstName, "first_name_label", "first_name")) isBlank = true;
        if (checkBlank(lastName, "last_name_label", "last_name")) isBlank = true;

        if (isBlank) return;

        // check password
        if (!passwordComplexity(password, "password_label", "password")) return;

        let obj = { login: login, firstName: firstName, lastName: lastName, password: password, email: email };
        let js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/register'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            let res = JSON.parse(await response.text());

            if (res.error) {
                console.error("Full fetch error inside catch:", error);
                alert('Error: ' + res.error);
            }
            else {
                let user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));
                localStorage.setItem('verify_email', email);
                // window.location.href = '/emailVerification'; // lets see if this fixes anything
                window.location.href = '/verify';
            }
        }
        catch (error: any) {
            console.error("Full fetch error inside catch:", error);
            alert(error.toString());
            return;
        }
    }

    const toggleForm = () => {
        setShowSignup(prev => !prev);
        setError("");
    };


    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
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

            {error && <div id="error_display">{error}</div>}

            {showSignup ? (
                <form className="signup_input fade-in-left" onSubmit={doRegister}>

                    {/* <h3>Create an account</h3> */}

                    <div className="input_div">
                        <label className="text" id="username_label">Username</label>
                        <input className="input" id="login" type="text" placeholder="Create username" value={login} onChange={((e) => setLogin(e.target.value))} />
                    </div>

                    <div className="input_div">
                        <label className="text" id="password_label">Password</label>
                        <input className="input" id="password" type={showPassword ? "text" : "password"} placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <img
                            src={showPassword ? "/images/eyeOpened.png" : "/images/eyeCrossed.png"}
                            alt="Toggle Password Visibility"
                            id="password_visibility"
                            height="20"
                            width="20"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }} // can change to css
                        />
                        <p className='password_requirements'>Minimum of 8 characters with one special character</p>
                    </div>

                    <div className="input_div">
                        <label className="text" id="email_label">Email</label>
                        {/* <input className="input" id="email" type="text" placeholder="Enter your Email"/>*/}
                        <input className="input" id="email" type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="input_div">
                        <label className="text" id="first_name_label">First Name</label>
                        <input className="input" id="first_name" type="text" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="input_div">
                        <label className="text" id="last_name_label">Last Name</label>
                        <input className="input" id="last_name" type="text" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
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
                <div className="login_page fade-in-right">

                    <div className="input_div">
                        <label className="text" id="username_label">Username</label>
                        <input className="input" id="username" type="text" placeholder="Enter your username" value={login} onChange={((e) => setLogin(e.target.value))} />
                    </div>

                    <div className="input_div">
                        <label className="text" id="password_label">Password</label>
                        <input className="input" id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <img
                            src={showPassword ? "/images/eyeOpened.png" : "/images/eyeCrossed.png"}
                            alt="Toggle Password Visibility"
                            id="password_visibility"
                            height="20"
                            width="20"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                        />
                        <a href='/forgot'>Forgot Password?</a>

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