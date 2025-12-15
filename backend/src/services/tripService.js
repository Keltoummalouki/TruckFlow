import Trip from '../models/tripModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Trip);

export const getAll = (filter = {}, options = {}) => {
    const searchOptions = {
        ...options,
        searchFields: options.searchFields || ['departureLoc', 'arrivalLoc']
    };
    return baseService.getAll(filter, 'truck driver', searchOptions);
};
export const getById = (id) => baseService.getById(id, 'truck driver');
export const create = (data) => baseService.create(data);
export const update = (id, data) => baseService.update(id, data);
export const deleteTrip = (id) => baseService.delete(id);

export const getByDriver = async (driverId) => {
    return await Trip.find({ driver: driverId }).populate('truck driver').sort({ createdAt: -1 });
};

export const getByStatus = async (status) => {
    return await Trip.find({ status }).populate('truck driver');
};

export const updateStatus = async (tripId, status, data = {}) => {
    return await update(tripId, { status, ...data });
};
