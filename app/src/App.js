// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated } from './utils/auth';

const App = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(isAuthenticated());
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setAuth={setIsAuth} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate replace to="/login" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated } from './utils/auth';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate replace to="/login" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
*/