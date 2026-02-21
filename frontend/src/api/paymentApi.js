import client from './client';

/**
 * Process a payment
 * @param {Object} paymentData - { reservationId, paymentMethod, referenceId }
 * @returns {Promise<Object>} Response data
 */
export const processPayment = async (paymentData) => {
    try {
        const response = await client.post('/payments/process', paymentData);
        // backend returns raw object, might be PaymentResponse or PayPalOrderResponse
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to process payment.');
    }
};

/**
 * Confirm a payment (primarily for PayPal callback)
 * @param {Object} confirmData - { reservationId, paymentMethod, referenceId }
 * @returns {Promise<Object>} PaymentResponse
 */
export const confirmPayment = async (confirmData) => {
    try {
        const response = await client.post('/payments/confirm', confirmData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to confirm payment.');
    }
};
