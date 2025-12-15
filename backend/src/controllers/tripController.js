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
        const { status, startMileage, endMileage, fuelVolume, comments, actualDeparture, actualArrival, distance, completionNotes } = req.body;
        const data = await tripService.updateStatus(req.params.id, status, {
            startMileage,
            endMileage,
            fuelVolume,
            comments,
            actualDeparture,
            actualArrival,
            distance,
            completionNotes
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const startTrip = async (req, res, next) => {
    try {
        const { startMileage } = req.body;
        const data = await tripService.updateStatus(req.params.id, 'in_progress', {
            startMileage,
            actualDeparture: new Date()
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const completeTrip = async (req, res, next) => {
    try {
        const { endMileage, fuelVolume, actualArrival, completionNotes } = req.body;

        const trip = await tripService.getById(req.params.id);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const distance = endMileage - (trip.startMileage || 0);

        const data = await tripService.updateStatus(req.params.id, 'completed', {
            endMileage,
            fuelVolume,
            actualArrival,
            completionNotes,
            distance
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const updateTripDetails = async (req, res, next) => {
    try {
        const { startMileage, endMileage, fuelVolume, comments, status } = req.body;
        const updateData = {};

        if (startMileage !== undefined) updateData.startMileage = startMileage;
        if (endMileage !== undefined) updateData.endMileage = endMileage;
        if (fuelVolume !== undefined) updateData.fuelVolume = fuelVolume;
        if (comments !== undefined) updateData.comments = comments;
        if (status !== undefined) updateData.status = status;

        const data = await tripService.update(req.params.id, updateData);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
