//src/components/CountyMap.js
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { fetchUserCounties, addCountyToUser, removeCountyFromUser } from '../api/counties';

const CountyMap = ({ userId }) => {
    const mapRef = useRef(null);
    const [countiesData, setCountiesData] = useState(null);
    const [activeCounties, setActiveCounties] = useState(new Set());

    useEffect(() => {
        if (!userId) {
            console.error("UserId is undefined");
            return;
        }
        fetchUserCounties(userId).then(data => {
            const activeSet = new Set(data.map(county => county.id));
            setActiveCounties(activeSet);
        }).catch(error => console.error("Error loading user counties:", error));

        if (!mapRef.current) { // Ensure map is only initialized once
            mapRef.current = L.map('map', {
                center: [37.8, -96.9],
                zoom: 4
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(mapRef.current);
        }

        fetch("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json")
            .then(response => response.json())
            .then(data => {
                setCountiesData(data);
            }).catch(error => console.error("Error loading GeoJSON data:", error));

        return () => mapRef.current?.remove();
    }, [userId]);

    useEffect(() => {
        if (countiesData && mapRef.current) {
            const geoJsonLayer = L.geoJson(countiesData, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => toggleCounty(feature.properties.FIPS));
                    const isActive = activeCounties.has(feature.properties.FIPS);
                    layer.setStyle(getStyle(isActive));
                }
            }).addTo(mapRef.current);

            return () => geoJsonLayer.remove();
        }
    }, [countiesData, activeCounties]);

    const toggleCounty = (countyId) => {
        const isActive = activeCounties.has(countyId);
        if (isActive) {
            removeCountyFromUser(userId, countyId).then(() => {
                activeCounties.delete(countyId);
                setActiveCounties(new Set(activeCounties));
            }).catch(error => console.error("Error removing county:", error));
        } else {
            addCountyToUser(userId, countyId).then(() => {
                activeCounties.add(countyId);
                setActiveCounties(new Set(activeCounties));
            }).catch(error => console.error("Error adding county:", error));
        }
    };

    const getStyle = (isActive) => ({
        fillColor: isActive ? 'red' : 'transparent',
        weight: 1,
        color: 'black',
        fillOpacity: isActive ? 0.5 : 0
    });

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default CountyMap;
