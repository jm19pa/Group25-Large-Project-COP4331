import { useState } from 'react';

 const app_name = 'pocketprofessors.com';
 function buildPath(route:string) : string
{
if (process.env.NODE_ENV != 'development')
{
return 'http://' + app_name + ':5000/' + route;
}
else
{
return 'http://localhost:5000/' + route;
}

}

function Register(){
	const [Username, setUsername] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [Password, setPassword] = useState('');
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

async function doRegister(event:any) : Promise<void>
{
	event.preventDefault();
	var obj = {login:Username,firstName:firstName,lastName:lastName,password:Password};
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
  			<input placeholder="Username" id="login" value={Username} onChange={((e) => setUsername(e.target.value))}></input>

            <label>First Name: </label>
  			<input placeholder="First Name" type="text" id="first_name" value={firstName} onChange={(e)=> setFirstName(e.target.value)}></input>
            
            <br/>
            
            <label>Password: </label>
  			<input placeholder="Password" type="text" id="password" value={Password} onChange={(e)=>setPassword(e.target.value)}></input>

            <label>Last Name: </label>
  			<input placeholder="Last Name" type="text" id="last_name" value={lastName} onChange={(e)=>setLastName(e.target.value)}></input>
		</div>
		<button type="submit" id="registerButton" className="buttons">Register!</button>
		</form>
		
        <h5>Already have an account?</h5>
        <button type="button" id="Login" className="buttons"
                onClick={goToLoginPage}> Login </button>
		<br/>
		
	</div>
)

}
export default Register;
