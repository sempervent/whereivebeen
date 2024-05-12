// src/utils/auth.js
// Function to logout a user
export const logout = () => {
    localStorage.removeItem('token');
};

// Helper function to get the access token from local storage
export const getAccessToken = () => {
    return localStorage.getItem('token');
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


