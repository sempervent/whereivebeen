// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(''); // Optional, if you require email
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Here, implement your logic to call the backend API to register the user
        console.log('Submitting:', username, password, email);

        // On successful registration, redirect to login or another appropriate page
        navigate('/login');
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label>
                    Email: {/* Optional */}
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
