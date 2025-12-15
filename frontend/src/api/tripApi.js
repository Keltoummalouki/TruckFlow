import axiosClient from './axiosClient';

// Get all trips with pagination, search, and filters
export const getTrips = async (params = {}) => {
    const response = await axiosClient.get('/trips', { params });
    return response.data;
};

// Get single trip by ID
export const getTripById = async (id) => {
    const response = await axiosClient.get(`/trips/${id}`);
    return response.data;
};

// Create new trip
export const createTrip = async (tripData) => {
    const response = await axiosClient.post('/trips', tripData);
    return response.data;
};

// Update trip
export const updateTrip = async (id, tripData) => {
    const response = await axiosClient.put(`/trips/${id}`, tripData);
    return response.data;
};

// Delete trip
export const deleteTrip = async (id) => {
    const response = await axiosClient.delete(`/trips/${id}`);
    return response.data;
};

// Get trips by driver
export const getTripsByDriver = async (driverId) => {
    const response = await axiosClient.get(`/trips/driver/${driverId}`);
    return response.data;
};

// Get trips by status
export const getTripsByStatus = async (status) => {
    const response = await axiosClient.get(`/trips/status/${status}`);
    return response.data;
};

// Update trip status
export const updateTripStatus = async (id, statusData) => {
    const response = await axiosClient.patch(`/trips/${id}/status`, statusData);
    return response.data;
};

// Download trip PDF
export const downloadTripPDF = async (id) => {
    const response = await axiosClient.get(`/trips/${id}/pdf`, {
        responseType: 'blob'
    });
    return response.data;
};
