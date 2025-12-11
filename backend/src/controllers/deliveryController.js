import * as deliveryService from '../services/deliveryService.js';
import { createBaseController } from './baseController.js';

const baseController = createBaseController(deliveryService);

export const getAll = baseController.getAll;
export const getById = baseController.getById;
export const create = baseController.create;
export const update = baseController.update;
export const deleteDelivery = baseController.delete;
