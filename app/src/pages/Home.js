// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Where I've Been</h1>
            <p>This is an interactive map application to select and manage U.S. counties.</p>
            <Link to="/login">Log in</Link> to start selecting counties or <Link to="/register">register</Link> if you don't have an account.
        </div>
    );
};

export default Home;
