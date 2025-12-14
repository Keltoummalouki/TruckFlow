import axiosClient from './axiosClient';

// Get all trailers with pagination, search, and filters
export const getTrailers = async (params = {}) => {
    const response = await axiosClient.get('/trailers', { params });
    return response.data;
};

// Get single trailer by ID
export const getTrailerById = async (id) => {
    const response = await axiosClient.get(`/trailers/${id}`);
    return response.data;
};

// Create new trailer
export const createTrailer = async (trailerData) => {
    const response = await axiosClient.post('/trailers', trailerData);
    return response.data;
};

// Update trailer
export const updateTrailer = async (id, trailerData) => {
    const response = await axiosClient.put(`/trailers/${id}`, trailerData);
    return response.data;
};

// Delete trailer
export const deleteTrailer = async (id) => {
    const response = await axiosClient.delete(`/trailers/${id}`);
    return response.data;
};

// Get available trailers
export const getAvailableTrailers = async () => {
    const response = await axiosClient.get('/trailers/available');
    return response.data;
};

// Assign truck to trailer
export const assignTruck = async (trailerId, truckId) => {
    const response = await axiosClient.post(`/trailers/${trailerId}/assign`, { truckId });
    return response.data;
};

// Unassign truck from trailer
export const unassignTruck = async (trailerId) => {
    const response = await axiosClient.post(`/trailers/${trailerId}/unassign`);
    return response.data;
};
