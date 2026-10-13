const API_BASE = 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

// Parking APIs
export const getAllParkingSpaces = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_BASE}/parking${query ? '?' + query : ''}`);
};
export const getAvailableParkingSpaces = () => apiCall(`${API_BASE}/parking/available`);
export const getParkingSpaceById = (id) => apiCall(`${API_BASE}/parking/${id}`);
export const createParkingSpace = (data) => apiCall(`${API_BASE}/parking`, { method: 'POST', body: JSON.stringify(data) });
export const updateParkingSpace = (id, data) => apiCall(`${API_BASE}/parking/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteParkingSpace = (id) => apiCall(`${API_BASE}/parking/${id}`, { method: 'DELETE' });

// Reservation APIs
export const createReservation = (data) => apiCall(`${API_BASE}/reservations`, { method: 'POST', body: JSON.stringify(data) });
export const getAllReservations = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_BASE}/reservations${query ? '?' + query : ''}`);
};
export const getReservationById = (id) => apiCall(`${API_BASE}/reservations/${id}`);
export const searchReservationsByVehicle = (vehicleNumber) => apiCall(`${API_BASE}/reservations/search?vehicleNumber=${encodeURIComponent(vehicleNumber)}`);
export const cancelReservation = (id) => apiCall(`${API_BASE}/reservations/${id}/cancel`, { method: 'PUT' });

// Admin APIs
export const getAdminStatistics = () => apiCall(`${API_BASE}/admin/statistics`);
