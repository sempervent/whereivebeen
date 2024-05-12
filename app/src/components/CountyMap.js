//src/components/CountyMap.js
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchUserCounties, addCountyToUser, removeCountyFromUser } from '../api/counties';

const CountyMap = ({ userId }) => {
    const mapRef = useRef(null);
    const [countiesData, setCountiesData] = useState(null);
    const [activeCounties, setActiveCounties] = useState(new Set());

    // Initialize the map and fetch counties data
    useEffect(() => {
        if (!userId) {
            console.error("UserId is undefined");
            return;
        }

        // Fetch user-specific counties
        fetchUserCounties(userId).then(data => {
            const activeSet = new Set(data.map(county => county.id));
            setActiveCounties(activeSet);
            console.info('Loaded user counties:', activeSet);
        }).catch(error => {
            console.error("Error loading user counties:", error);
        });

        // Initialize the map only once
        if (!mapRef.current) {
            mapRef.current = L.map('map', {
                center: [37.8, -96.9],  // Center of the US
                zoom: 4
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(mapRef.current);

            console.log('Map initialized');
        }

        // Fetch GeoJSON for counties
        fetch("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json")
            .then(response => response.json())
            .then(data => {
                console.log('GeoJSON', data);
                setCountiesData(data);
                console.log('GeoJSON data loaded');
            }).catch(error => {
                console.error("Error loading GeoJSON data:", error);
            });

        return () => {
            mapRef.current?.remove();
        };
    }, [userId]);

    // Apply GeoJSON layers when data is available
    useEffect(() => {
        if (countiesData && mapRef.current) {
            const geoJsonLayer = L.geoJson(countiesData, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        const countyId = feature.properties.STATE + feature.properties.COUNTY;
                        toggleCounty(countyId)
                    });
                    const isActive = activeCounties.has(feature.properties.STATE + feature.properties.COUNTY);
                    layer.setStyle(getStyle(isActive));
                }
            }).addTo(mapRef.current);

            console.log('GeoJSON layers applied');
            return () => geoJsonLayer.remove();
        }
    }, [countiesData, activeCounties]);

    // Toggle county selection
    const toggleCounty = (countyId) => {
        console.log('Toggling county:', countyId, 'for user:', userId);
        const isActive = activeCounties.has(countyId);
        if (isActive) {
            removeCountyFromUser(userId, countyId).then(() => {
                console.log('County removed:', countyId, 'for user:', userId);
                const newSet = new Set(activeCounties);
                newSet.delete(countyId);
                setActiveCounties(newSet);
                console.log('County removed:', countyId);
            }).catch(error => {
                console.error("Error removing county:", error);
            });
        } else {
            addCountyToUser(userId, countyId).then(() => {
                console.log('County added:', countyId, 'for user:', userId);
                const newSet = new Set(activeCounties);
                newSet.add(countyId);
                setActiveCounties(newSet);
                console.log('County added:', countyId);
            }).catch(error => {
                console.error("Error adding county:", error);
            });
        }
    };

    // Define styles for the counties
    const getStyle = (isActive) => ({
        fillColor: isActive ? 'red' : 'transparent',
        weight: 1,
        color: 'black',
        fillOpacity: isActive ? 0.5 : 0
    });

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default CountyMap;
