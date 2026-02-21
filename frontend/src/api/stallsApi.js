import client from './client';

/**
 * Create a new stall
 * @param {Object} stallData - { stallCode, stallSize, price }
 * @returns {Promise<Object>} Response data
 */
export const createStall = async (stallData) => {
    try {
        const response = await client.post('/stalls/create', stallData);
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to create stall. Please try again.';
        throw new Error(message);
    }
};

/**
 * Get all stalls
 * @returns {Promise<Object>} Response data
 */
export const getAllStalls = async () => {
    try {
        const response = await client.get('/stalls/all');
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stalls.');
    }
};

