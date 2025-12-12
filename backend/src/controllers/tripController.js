// backend/src/controllers/tripController.js
import * as tripService from '../services/tripService.js';
import { createBaseController } from './baseController.js';

const baseController = createBaseController(tripService);

export const getAll = baseController.getAll;
export const getById = baseController.getById;
export const create = baseController.create;
export const update = baseController.update;
export const deleteTrip = async (req, res, next) => {
    try {
        await tripService.deleteTrip(req.params.id);
        res.json({ success: true, message: 'Resource deleted' });
    } catch (error) {
        next(error);
    }
};

export const getByDriver = async (req, res, next) => {
    try {
        const data = await tripService.getByDriver(req.params.driverId);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getByStatus = async (req, res, next) => {
    try {
        const data = await tripService.getByStatus(req.params.status);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { status, startMileage, endMileage, fuelVolume, comments } = req.body;
        const data = await tripService.updateStatus(req.params.id, status, {
            startMileage,
            endMileage,
            fuelVolume,
            comments
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
