// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ backgroundColor: '#007bff', color: '#ffffff', padding: '10px 20px' }}>
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                <li style={{ display: 'inline', marginRight: '20px' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                </li>
                <li style={{ display: 'inline' }}>
                    <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
