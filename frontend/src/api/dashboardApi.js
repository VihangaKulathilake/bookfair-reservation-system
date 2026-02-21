import client from './client';

const normalizeRole = (role) => {
    if (role === 'EMPLOYEE') return 'EMPLOYEE';
    if (role === 'BUSINESS') return 'BUSINESS';
    return null;
};

export const resolveRoleByEmail = async (email) => {
    const response = await client.get('/admin/vendors');
    const vendors = Array.isArray(response.data) ? response.data : [];
    const matchedVendor = vendors.find(
        (vendor) => vendor?.email?.toLowerCase() === email.toLowerCase()
    );

    if (matchedVendor) {
        return {
            role: 'BUSINESS',
            userId: matchedVendor.id,
            vendor: matchedVendor,
        };
    }

    return {
        role: 'EMPLOYEE',
        userId: null,
        vendor: null,
    };
};

export const getVendorById = async (id) => {
    const response = await client.get(`/admin/vendors/${id}`);
    return response.data;
};

export const getVendors = async () => {
    const response = await client.get('/admin/vendors');
    return response.data ?? [];
};

export const updateVendor = async (id, payload) => {
    const response = await client.put(`/admin/vendors/${id}`, payload);
    return response.data;
};

export const deleteVendor = async (id) => {
    await client.delete(`/admin/vendors/${id}`);
};

export const getUserById = async (id) => {
    const response = await client.get(`/users/${id}`);
    return response.data;
};

export const getUserByEmail = async (email) => {
    const response = await client.get(`/users/by-email`, { params: { email } });
    return response.data;
};

export const updateUser = async (id, payload) => {
    const response = await client.put(`/users/${id}`, payload);
    return response.data;
};

export const getAllReservations = async () => {
    const response = await client.get('/reservations/all');
    return response.data ?? [];
};

export const getReservationsByUserId = async (userId) => {
    const response = await client.get(`/reservations/user/${userId}`);
    return response.data ?? [];
};

export const updateReservationStatus = async (id, status) => {
    const response = await client.put(`/reservations/${id}/status`, null, {
        params: { status },
    });
    return response.data;
};

export const deleteReservation = async (id) => {
    await client.delete(`/reservations/${id}`);
};

export const getAllPayments = async () => {
    const response = await client.get('/payments/all');
    return response.data ?? [];
};

export const getPaymentsByUserId = async (userId) => {
    const response = await client.get(`/payments/user/${userId}`);
    return response.data ?? [];
};

export const confirmCashPayment = async (paymentId) => {
    const response = await client.put(`/payments/${paymentId}/confirm`);
    return response.data;
};

export const updateReservation = async (id, payload) => {
    const response = await client.put(`/reservations/${id}`, payload);
    return response.data;
};

export const updatePayment = async (id, payload) => {
    const response = await client.put(`/payments/${id}`, payload);
    return response.data;
};

export const deletePayment = async (id) => {
    await client.delete(`/payments/${id}`);
};

export const getGenresByVendor = async (vendorEmail) => {
    const response = await client.get('/vendor/genres', {
        params: { vendorEmail },
    });
    return response.data ?? [];
};

export const createGenre = async (payload) => {
    const response = await client.post('/vendor/genres', payload);
    return response.data;
};

export const updateGenre = async (id, payload) => {
    const response = await client.put(`/vendor/genres/${id}`, payload);
    return response.data;
};

export const deleteGenre = async (id) => {
    await client.delete(`/vendor/genres/${id}`);
};

export const createReservation = async (payload) => {
    const response = await client.post('/reservations/create', payload);
    return response.data;
};

export const cancelReservation = async (id) => {
    const response = await client.put(`/reservations/cancel/${id}`);
    return response.data;
};

export const getAvailableStalls = async () => {
    const response = await client.get('/stalls/available');
    return response.data ?? [];
};

export const getAllStalls = async () => {
    const response = await client.get('/stalls/all');
    return response.data ?? [];
};

export const deleteStall = async (id) => {
    await client.delete(`/stalls/${id}`);
};

export const updateStall = async (id, data) => {
    const response = await client.put(`/stalls/update/${id}`, data);
    return response.data;
};

export const getStoredAuth = () => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return {
            ...parsed,
            role: normalizeRole(parsed.role),
        };
    } catch {
        return null;
    }
};
