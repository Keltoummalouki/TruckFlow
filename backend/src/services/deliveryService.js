import Delivery from '../models/deliveryModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Delivery);

export const getAll = (filter = {}) => baseService.getAll(filter, 'truck driver');
export const getById = (id) => baseService.getById(id, 'truck driver');
export const create = (data) => baseService.create(data);
export const update = (id, data) => baseService.update(id, data);
export const deleteDelivery = (id) => baseService.delete(id);
