// src/pages/Dashboard.js
import React from 'react';
import CountyMap from '../components/CountyMap';
import { fetchUserCounties } from '../api/counties';

const Dashboard = ({ userId }) => {
    const [selectedCounties, setSelectedCounties] = React.useState([]);

    React.useEffect(() => {
        fetchUserCounties(userId)
            .then(counties => setSelectedCounties(counties))
            .catch(error => console.error('Error fetching counties:', error));
    }, [userId]);

    return (
        <div>
            <h1>Dashboard</h1>
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
