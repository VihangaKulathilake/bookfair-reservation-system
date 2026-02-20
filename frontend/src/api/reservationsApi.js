import client from './client';

/**
 * Get all reservations
 * @returns {Promise<Object>} Response data
 */
export const getAllReservations = async () => {
    try {
        const response = await client.get('/reservations/all');
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch reservations.');
    }
};

/**
 * Update reservation status
 * @param {number} id - Reservation ID
 * @param {string} status - New status (APPROVED, REJECTED)
 * @returns {Promise<Object>} Response data
 */
export const updateReservationStatus = async (id, status) => {
    try {
        const response = await client.put(`/reservations/${id}/status?status=${status}`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update reservation status.');
    }
};

/**
 * Delete reservation
 * @param {number} id - Reservation ID
 * @returns {Promise<Object>} Response data
 */
export const deleteReservation = async (id) => {
    try {
        await client.delete(`/reservations/${id}`);
        return { success: true };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete reservation.');
    }
};
/**
 * Create a new reservation
 * @param {Object} reservationData - { userId, stallIds: [] }
 * @returns {Promise<Object>} Response data
 */
export const createReservation = async (reservationData) => {
    try {
        const response = await client.post('/reservations/create', reservationData);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create reservation.');
    }
};

/**
 * Get reservations by User ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Response data
 */
export const getReservationByUserId = async (userId) => {
    try {
        const response = await client.get(`/reservations/user/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user reservations.');
    }
};
