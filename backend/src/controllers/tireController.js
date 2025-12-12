import * as tireService from '../services/tireService.js';
import { createBaseController } from './baseController.js';

const baseController = createBaseController(tireService);

export const getAll = baseController.getAll;
export const getById = baseController.getById;
export const create = baseController.create;
export const update = baseController.update;
export const deleteTire = async (req, res, next) => {
    try {
        await tireService.deleteTire(req.params.id);
        res.json({ success: true, message: 'Resource deleted' });
    } catch (error) {
        next(error);
    }
};

export const getByStatus = async (req, res, next) => {
    try {
        const data = await tireService.getByStatus(req.params.status);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const assignToTruck = async (req, res, next) => {
    try {
        const { truckId, position } = req.body;
        const data = await tireService.assignToTruck(req.params.id, truckId, position);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const unassignFromTruck = async (req, res, next) => {
    try {
        const data = await tireService.unassignFromTruck(req.params.id);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
