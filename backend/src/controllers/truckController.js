import * as truckService from '../services/truckService.js';
import { createBaseController } from './baseController.js';

const baseController = createBaseController(truckService);

export const getAll = baseController.getAll;
export const getById = baseController.getById;
export const create = baseController.create;
export const update = baseController.update;
export const deleteTruck = baseController.delete;

export const getAvailable = async (req, res, next) => {
    try {
        const data = await truckService.getAvailableTrucks();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const assignDriver = async (req, res, next) => {
    try {
        const data = await truckService.assignDriver(req.params.id, req.body.driverId);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const unassignDriver = async (req, res, next) => {
    try {
        const data = await truckService.unassignDriver(req.params.id);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
