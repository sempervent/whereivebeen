//src/api/counties.js
import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8000';

// Set up common configuration for axios requests
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Function to fetch all counties associated with a specific user
export const fetchUserCounties = async (userId) => {
    if (!userId) {
        console.error('fetchUserCounties called without userId');
        throw new Error('User ID is required for fetching counties.');
    }
    try {
        const response = await apiClient.get(`/users/${userId}/counties`);
        // Extract counties from response data
        if (response.data && Array.isArray(response.data.counties)) {
            return response.data.counties;
        } else {
            console.error('Unexpected response structure:', response.data);
            throw new Error('Unexpected response structure');
        }
    } catch (error) {
        console.error('Failed to fetch counties:', error);
        throw error;
    }
};

// Function to add a county to the user's selection
export const addCountyToUser = async (userId, countyId) => {
    if (!userId || !countyId) {
        console.error('addCountyToUser called without userId or countyId');
        throw new Error('User ID and County ID are required.');
    }
    try {
        const response = await apiClient.post(`/users/${userId}/counties/${countyId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to add county:', error);
        throw e
    }
};


// Function to remove a county from the user's selection
export const removeCountyFromUser = async (userId, countyId) => {
    if (!userId || !countyId) {
        console.error('removeCountyFromUser called without userId or countyId');
        throw new Error('User ID and County ID are required.');
    }
    try {
        const response = await apiClient.delete(`/users/${userId}/counties/${countyId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to remove county:', error);
        throw error;
    }
};
