import { useState } from 'react';

const app_name = 'pocketprofessors.com';
function buildPath(route:string) : string
{
if (process.env.NODE_ENV != 'development')
{
return 'http://' + app_name + '/' + route;
}
else
{
return 'http://localhost:5000/' + route;
}

}

function Register(){
	const [login, setLogin] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
/*
function handleSetUsername(e: any): void{
	setUsername(e.target.value);
}
function handleSetFirstName(e: any): void{
	setFirstName(e.target.value);
}
function handleSetLastName(e: any): void{
	setLastName(e.target.value);
}
function handleSetPassword(e: any): void{
	setPassword(e.target.value);
}
*/
function goToLoginPage(): void{
    window.location.href = '/login';
}

function showPassword(): void {
        const passwordField = document.getElementById('password') as HTMLInputElement;
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    };

async function doRegister(event:any) : Promise<void>
{
	event.preventDefault();
	var obj = {login:login,firstName:firstName,lastName:lastName,password:password};
	var js = JSON.stringify(obj);
	try
	{
		const response = await fetch(buildPath('api/register'),
		{method:'POST',body:js,headers:{'Content-Type':
		'application/json'}});
		var res = JSON.parse(await response.text());
		if( res.error)
		{
			alert('Error: ' + res.error);
		}
		else
		{
			var user =
			{firstName:res.firstName,lastName:res.lastName,id:res.id}
			localStorage.setItem('user_data', JSON.stringify(user));
			window.location.href = '/login';
		}
	}
	catch(error:any)
	{
		alert(error.toString());
		return;
	}
}

return(
	<div>
	<h1>REGISTER</h1>
	<p>Please Register</p>
		<form onSubmit={doRegister}>
		<div>
  			<label>Login: </label>
  			<input placeholder="Username" id="login" value={login} onChange={((e) => setLogin(e.target.value))}></input>

            <label>First Name: </label>
  			<input placeholder="First Name" type="text" id="first_name" value={firstName} onChange={(e)=> setFirstName(e.target.value)}></input>
            
            <br/>
            
            <label>Password: </label>
  			<input placeholder="Password" type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>

			<label style={{ cursor: 'pointer' }}>
            <input
                type="checkbox"
                onClick={showPassword}
            />
            </label>

            <label>Last Name: </label>
  			<input placeholder="Last Name" type="text" id="last_name" value={lastName} onChange={(e)=>setLastName(e.target.value)}></input>
		</div>
		<button type="submit" id="registerButton" className="buttons">Register!</button>
		</form>
		
        <h5>Already have an account?</h5>
        <button type="button" id="Login" className="buttons"
                onClick={goToLoginPage}> Login </button>
		<br/>
		<h1>quick test again ill comment this out later</h1>
		
	</div>
)

}
export default Register;
