import * as tripService from '../services/tripService.js';

export const getMyTrips = async (req, res, next) => {
    try {
        const driverId = req.user.id.toString();
        const data = await tripService.getByDriver(driverId);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const updateTripStatus = async (req, res, next) => {
    try {
        const { status, startMileage, endMileage, fuelVolume, comments } = req.body;
        const driverId = req.user.id.toString();
        
        const trip = await tripService.getById(req.params.id);
        const tripDriverId = trip.driver._id ? trip.driver._id.toString() : trip.driver.toString();
        
        if (tripDriverId !== driverId) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this trip' });
        }
        
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

export const getTripById = async (req, res, next) => {
    try {
        const driverId = req.user.id.toString();
        const trip = await tripService.getById(req.params.id);
        
        const tripDriverId = trip.driver._id ? trip.driver._id.toString() : trip.driver.toString();
        
        if (tripDriverId !== driverId) {
            return res.status(403).json({ success: false, error: 'Not authorized to view this trip' });
        }
        
        res.json({ success: true, data: trip });
    } catch (error) {
        next(error);
    }
};
