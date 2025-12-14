import axiosClient from './axiosClient';

// Get all trucks with pagination, search, and filters
export const getTrucks = async (params = {}) => {
    const response = await axiosClient.get('/trucks', { params });
    return response.data;
};

// Get single truck by ID
export const getTruckById = async (id) => {
    const response = await axiosClient.get(`/trucks/${id}`);
    return response.data;
};

// Create new truck
export const createTruck = async (truckData) => {
    const response = await axiosClient.post('/trucks', truckData);
    return response.data;
};

// Update truck
export const updateTruck = async (id, truckData) => {
    const response = await axiosClient.put(`/trucks/${id}`, truckData);
    return response.data;
};

// Delete truck
export const deleteTruck = async (id) => {
    const response = await axiosClient.delete(`/trucks/${id}`);
    return response.data;
};

// Get available trucks
export const getAvailableTrucks = async () => {
    const response = await axiosClient.get('/trucks/available');
    return response.data;
};

// Assign driver to truck
export const assignDriver = async (truckId, driverId) => {
    const response = await axiosClient.post(`/trucks/${truckId}/assign`, { driverId });
    return response.data;
};

// Unassign driver from truck
export const unassignDriver = async (truckId) => {
    const response = await axiosClient.post(`/trucks/${truckId}/unassign`);
    return response.data;
};
