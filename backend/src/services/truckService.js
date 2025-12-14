import Truck from '../models/truckModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Truck);

export const getAll = (filter = {}, options = {}) => {
  // Add search fields for trucks
  const searchOptions = {
    ...options,
    searchFields: options.searchFields || ['licensePlate', 'brand', 'model']
  };
  return baseService.getAll(filter, 'driver', searchOptions);
};

export const getById = (id) => baseService.getById(id, 'driver');

export const create = (data) => baseService.create(data);

export const update = (id, data) => baseService.update(id, data);

export const deleteTruck = (id) => baseService.delete(id);

export const getAvailableTrucks = async () => {
  return await Truck.find({ status: 'active' });
};

export const assignDriver = async (truckId, driverId) => {
  return await update(truckId, { driver: driverId });
};

export const unassignDriver = async (truckId) => {
  return await update(truckId, { driver: null });
};
