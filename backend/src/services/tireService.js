import Tire from '../models/tireModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Tire);

export const getAll = (filter = {}) => baseService.getAll(filter, 'truck');
export const getById = (id) => baseService.getById(id, 'truck');
export const create = (data) => baseService.create(data);
export const update = (id, data) => baseService.update(id, data);
export const deleteTire = (id) => baseService.delete(id);

export const getByStatus = async (status) => {
    return await Tire.find({ status }).populate('truck');
};

export const assignToTruck = async (tireId, truckId, position) => {
    return await update(tireId, { truck: truckId, position, status: 'in_use', installationDate: new Date() });
};

export const unassignFromTruck = async (tireId) => {
    return await update(tireId, { truck: null, position: 'spare', status: 'new' });
};
