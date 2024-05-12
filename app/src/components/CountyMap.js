import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CountyMap = ({ onCountyClick }) => {
    const mapRef = useRef(null);
    const [countiesData, setCountiesData] = useState(null);

    useEffect(() => {
        // Initialize the map
        mapRef.current = L.map('map', {
            center: [37.8, -96.9],  // Center of the US
            zoom: 4
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapRef.current);

        // Fetch the GeoJSON data
        fetch("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json")
            .then(response => response.json())
            .then(data => {
                setCountiesData(data);
            });

        return () => {
            mapRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (countiesData && mapRef.current) {
            const geoJsonLayer = L.geoJson(countiesData, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => onCountyClick(feature));
                    layer.setStyle({
                        fillColor: '#fc4e2a',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.5
                    });
                }
            }).addTo(mapRef.current);

            return () => geoJsonLayer.remove();
        }
    }, [countiesData, onCountyClick]);

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default CountyMap;
