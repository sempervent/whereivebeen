// src/pages/Login.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await onLogin(username, password);
            history.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div>
                <label htmlFor="username">Username:</label>
                <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;
