//src/components/CountyMap.js
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchUserCounties, addCountyToUser, removeCountyFromUser } from '../api/counties';

const CountyMap = ({ userId }) => {
    const mapRef = useRef(null);
    const [geoJsonData, setGeoJsonData] = useState(null); // Separate state for GeoJSON data
    const [activeCounties, setActiveCounties] = useState(new Set()); // Correctly initialized state for active counties

    useEffect(() => {
        if (!userId) {
            console.error("UserId is undefined");
            return;
        }

        // Fetch user-specific counties
        const fetchCounties = async () => {
            try {
                const userCounties = await fetchUserCounties(userId);
                console.log('User counties:', userCounties);
                setActiveCounties(new Set(userCounties)); // Correctly update active counties
            } catch (error) {
                console.error('Error fetching user counties:', error);
            }
        };
        fetchCounties();

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
        }

        // Fetch GeoJSON for counties
        fetch("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json")
            .then(response => response.json())
            .then(data => {
                setGeoJsonData(data); // Separate state for GeoJSON data
            }).catch(error => {
                console.error("Error loading GeoJSON data:", error);
            });

        return () => mapRef.current?.remove();
    }, [userId]);

    useEffect(() => {
        if (geoJsonData && mapRef.current) {
            const geoJsonLayer = L.geoJson(geoJsonData, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        const countyId = feature.properties.STATE + feature.properties.COUNTY;
                        toggleCounty(countyId);
                    });
                    const isActive = activeCounties.has(feature.properties.STATE + feature.properties.COUNTY);
                    layer.setStyle(getStyle(isActive));
                }
            }).addTo(mapRef.current);

            return () => geoJsonLayer.remove();
        }
    }, [geoJsonData, activeCounties]);

    // Toggle county selection
    const toggleCounty = (countyId) => {
        console.log('Toggling county:', countyId);
        const isActive = activeCounties.has(countyId);
        if (isActive) {
            removeCountyFromUser(userId, countyId).then(() => {
                const newSet = new Set(activeCounties);
                newSet.delete(countyId);
                setActiveCounties(newSet);
            }).catch(error => {
                console.error("Error removing county:", error);
            });
        } else {
            addCountyToUser(userId, countyId).then(() => {
                const newSet = new Set(activeCounties);
                newSet.add(countyId);
                setActiveCounties(newSet);
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
