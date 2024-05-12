// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import CountyMap from '../components/CountyMap';
import { fetchUserCounties } from '../api/counties';

const Dashboard = () => {
    const [selectedCounties, setSelectedCounties] = useState([]);
    // Retrieve userId from localStorage right in the component to ensure it's always current
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchUserCounties(userId)
                .then(counties => setSelectedCounties(counties))
                .catch(error => console.error('Error fetching counties:', error));
        } else {
            console.error("No userId found, please ensure you're logged in.");
        }
    }, [userId]); // Dependency on userId ensures it reacts to changes in userId

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Pass userId directly from the state, ensuring it's defined */}
            <CountyMap userId={userId} />
            <div>
                <h2>Your Selected Counties</h2>
                <ul>
                    {selectedCounties.map(county => (
                        <li key={county.id}>{county.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
