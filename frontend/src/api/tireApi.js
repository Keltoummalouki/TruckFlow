import axiosClient from './axiosClient';

export const getTires = async (params = {}) => {
    const response = await axiosClient.get('/tires', { params });
    return response.data;
};

export const getTireById = async (id) => {
    const response = await axiosClient.get(`/tires/${id}`);
    return response.data;
};

export const createTire = async (tireData) => {
    const response = await axiosClient.post('/tires', tireData);
    return response.data;
};

export const updateTire = async (id, tireData) => {
    const response = await axiosClient.put(`/tires/${id}`, tireData);
    return response.data;
};

export const deleteTire = async (id) => {
    const response = await axiosClient.delete(`/tires/${id}`);
    return response.data;
};

export const assignTire = async (tireId, assignData) => {
    const response = await axiosClient.post(`/tires/${tireId}/assign`, assignData);
    return response.data;
};

export const unassignTire = async (tireId) => {
    const response = await axiosClient.post(`/tires/${tireId}/unassign`);
    return response.data;
};
