// src/utils/auth.js
import axios from 'axios';

const API_BASE_URL = 'http://backend:8000'; // Adjust this URL based on your backend's URL

// Function to login a user
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/token`, { username, password });
        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        return response.data;
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
};

// Function to logout a user
export const logout = () => {
    localStorage.removeItem('accessToken');
};

// Helper function to get the access token from local storage
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// Utility to check if the user is logged in
export const isAuthenticated = () => {
    const token = getAccessToken();
    return !!token;
};

// Helper function to configure headers for making authenticated API requests
export const getAuthHeaders = () => {
    const token = getAccessToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
};

// Optionally, you can add a function to handle user registration
export const register = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};
