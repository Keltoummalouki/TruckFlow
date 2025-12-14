import axiosClient from './axiosClient';

// Get all drivers (users with role='driver') with pagination and search
export const getDrivers = async (params = {}) => {
    const response = await axiosClient.get('/auth/users', {
        params: { ...params, role: 'driver' }
    });
    return response.data;
};

// Get single driver/user by ID
export const getDriverById = async (id) => {
    const response = await axiosClient.get(`/auth/users/${id}`);
    return response.data;
};

// Create new driver (register user with driver role)
export const createDriver = async (driverData) => {
    const response = await axiosClient.post('/auth/register', {
        ...driverData,
        role: 'driver'
    });
    return response.data;
};

// Update driver information
export const updateDriver = async (id, driverData) => {
    const response = await axiosClient.put(`/auth/users/${id}`, driverData);
    return response.data;
};

// Delete/deactivate driver
export const deleteDriver = async (id) => {
    const response = await axiosClient.delete(`/auth/users/${id}`);
    return response.data;
};

// Get driver's assigned trips
export const getDriverTrips = async (driverId) => {
    const response = await axiosClient.get(`/trips/driver/${driverId}`);
    return response.data;
};
