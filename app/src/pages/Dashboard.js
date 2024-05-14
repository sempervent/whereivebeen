// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import CountyMap from '../components/CountyMap';
import { fetchUserCounties } from '../api/counties';

const exportMapAsImage = () => {
    const map = mapRef.current;
    if (!map) return;

    // Temporarily adjust style for export
    map.eachLayer(layer => {
        if (layer.feature && layer.feature.properties) {  // Check if it's a county layer
            originalStyle = layer.options.style;  // Store original style if necessary
            layer.setStyle({fillOpacity: 1});  // Set fill opacity to 1 for export
        }
    });

    map.once('render', () => {
        const canvas = document.createElement('canvas');
        const dimensions = map.getSize();
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        const context = canvas.getContext('2d');

        document.querySelectorAll('.leaflet-tile-pane img, .leaflet-overlay-pane svg').forEach(img => {
            const rect = img.getBoundingClientRect();
            context.drawImage(img, rect.left - mapContainer.left, rect.top - mapContainer.top);
        });

        // Convert canvas to an image
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'map-export.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);

            // Reset styles if necessary
            map.eachLayer(layer => {
                if (layer.feature && layer.feature.properties) {  // Check if it's a county layer
                    layer.setStyle(originalStyle);  // Reset to original style
                }
            });
        }, 'image/png');

        // Force map re-render to clean up any temporary styling
        map.invalidateSize();
    });

    // Render the map immediately to ensure the style changes are captured
    map.render();
};


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
                <button onClick={{exportMapAsImage}}>Export Map</button>
            </div>
        </div>
    );
};

export default Dashboard;
