import axiosClient from './axiosClient';

// Get all maintenance records with pagination and filters
export const getMaintenances = async (params = {}) => {
    const response = await axiosClient.get('/maintenance', { params });
    return response.data;
};

// Get single maintenance record by ID
export const getMaintenanceById = async (id) => {
    const response = await axiosClient.get(`/maintenance/${id}`);
    return response.data;
};

// Create new maintenance record
export const createMaintenance = async (maintenanceData) => {
    const response = await axiosClient.post('/maintenance', maintenanceData);
    return response.data;
};

// Update maintenance record
export const updateMaintenance = async (id, maintenanceData) => {
    const response = await axiosClient.put(`/maintenance/${id}`, maintenanceData);
    return response.data;
};

// Delete maintenance record
export const deleteMaintenance = async (id) => {
    const response = await axiosClient.delete(`/maintenance/${id}`);
    return response.data;
};

// Get maintenance by target (truck, trailer, tire)
export const getMaintenanceByTarget = async (targetType, targetId) => {
    const response = await axiosClient.get(`/maintenance/target/${targetType}/${targetId}`);
    return response.data;
};

// Get upcoming maintenance
export const getUpcomingMaintenance = async () => {
    const response = await axiosClient.get('/maintenance/upcoming');
    return response.data;
};

// Check maintenance needed
export const checkMaintenanceNeeded = async () => {
    const response = await axiosClient.get('/maintenance/check');
    return response.data;
};
