import * as trailerService from '../services/trailerService.js';
import { createBaseController } from './baseController.js';

const baseController = createBaseController(trailerService);

export const getAll = baseController.getAll;
export const getById = baseController.getById;
export const create = baseController.create;
export const update = baseController.update;
export const deleteTrailer = async (req, res, next) => {
    try {
        await trailerService.deleteTrailer(req.params.id);
        res.json({ success: true, message: 'Resource deleted' });
    } catch (error) {
        next(error);
    }
};

export const getAvailable = async (req, res, next) => {
    try {
        const data = await trailerService.getAvailableTrailers();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const assignToTruck = async (req, res, next) => {
    try {
        const data = await trailerService.assignToTruck(req.params.id, req.body.truckId);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const unassignFromTruck = async (req, res, next) => {
    try {
        const data = await trailerService.unassignFromTruck(req.params.id);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getByType = async (req, res, next) => {
    try {
        const data = await trailerService.getByType(req.params.type);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};