import client from './client';

/**
 * Log in the user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Response data
 */
export const loginUser = async (email, password) => {
    try {
        const response = await client.post('/auth/login', { email, password });
        
        // Assuming the backend returns { token: '...', user: { ... } }
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }
        
        return { success: true, data: response.data };
    } catch (error) {
        // Extract error message from backend response if available
        const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
        throw new Error(message);
    }
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} Response data
 */
export const registerUser = async (userData) => {
    try {
        const response = await client.post('/auth/register', userData);
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        throw new Error(message);
    }
};

/**
 * Request password reset link
 * @param {string} email 
 * @returns {Promise<Object>} Response data
 */
export const resetPassword = async (email) => {
    try {
        const response = await client.post('/auth/forgot-password', { email });
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to send reset link. Please try again.';
        throw new Error(message);
    }
};

/**
 * Logout the user
 */
export const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};
