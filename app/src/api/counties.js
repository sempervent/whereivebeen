import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://backend:8000'; // Adjust as necessary

// Set up common configuration for axios requests
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Function to fetch all counties associated with a specific user
export const fetchUserCounties = async (userId) => {
    try {
        const response = await apiClient.get(`/users/${userId}/counties`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch counties:', error);
        throw error;
    }
};

// Function to add a county to the user's selection
export const addCountyToUser = async (userId, countyId) => {
    try {
        const response = await apiClient.post(`/users/${userId}/counties/${countyId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to add county:', error);
        throw error;
    }
};

// Function to remove a county from the user's selection
export const removeCountyFromUser = async (userId, countyId) => {
    try {
        const response = await apiClient.delete(`/users/${userId}/counties/${countyId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to remove county:', error);
        throw error;
    }
};
