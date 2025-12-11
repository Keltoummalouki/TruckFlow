import Truck from '../models/truckModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Truck);

export const getAll = (filter = {}) => baseService.getAll(filter, 'driver');

export const getById = (id) => baseService.getById(id, 'driver');

export const create = (data) => baseService.create(data);

export const update = (id, data) => baseService.update(id, data);

export const deleteTruck = (id) => baseService.delete(id);

export const getAvailableTrucks = async () => {
  return await Truck.find({ status: 'available' });
};

export const assignDriver = async (truckId, driverId) => {
    return await update(truckId, { driver: driverId, status: 'in_use' });
};

export const unassignDriver = async (truckId) => {
    return await update(truckId, { driver: null, status: 'available' });
};
