import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({onLogin}) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [loginErr, setLoginErr] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async() => {
		try {
			const loginResponse = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
				method: "POST",
				credentials: "include",
				headers: {"Content-type": "application/json"},
				body: JSON.stringify({name, email})
			})

			if (loginResponse.ok) {
				setLoginErr(false);
				onLogin();
				navigate("/search");
			} else {
				setLoginErr(true);
				throw new Error('Login response not ok!');
			}
		} catch(error) {
			setLoginErr(true);
			console.error('Error login!', error)
		}
	}

	return (
		<div className='login-container'>
			<input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} />
			<input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
			<button className='login-button' onClick={handleLogin}>Log in</button>
			{loginErr && <p className='error-message'>Please Login!</p>}
		</div>
	)
}

export default Login;
