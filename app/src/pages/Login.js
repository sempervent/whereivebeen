//src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const formBody = new URLSearchParams();
        formBody.append('username', username);
        formBody.append('password', password);

        try {
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody.toString()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `HTTP error! Status: ${response.status}, Message: ${errorData.detail}`);
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userId', data.user_id);
            console.log('Login successful:', data);
            console.log('userID:', data.user_id);
            setAuth(true);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;
