import Trailer from '../models/trailerModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Trailer);

export const getAll = (filter = {}) => baseService.getAll(filter, 'truck');

export const getById = (id) => baseService.getById(id, 'truck');

export const create = (data) => baseService.create(data);

export const update = (id, data) => baseService.update(id, data);

export const deleteTrailer = (id) => baseService.delete(id);

export const getAvailableTrailers = async () => {
    return await Trailer.find({ status: 'available' });
};

export const assignToTruck = async (trailerId, truckId) => {
    return await update(trailerId, { truck: truckId, status: 'in_use' });
};

export const unassignFromTruck = async (trailerId) => {
    return await update(trailerId, { truck: null, status: 'available' });
};

export const getByType = async (type) => {
    return await Trailer.find({ type }).populate('truck');
};