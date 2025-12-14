import Joi from 'joi';

export const createTripSchema = Joi.object({
    scheduledDeparture: Joi.date().required(),
    departureLoc: Joi.string().required(),
    arrivalLoc: Joi.string().required(),
    truck: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    driver: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
    startMileage: Joi.number().min(0).optional().allow(null, ''),
    endMileage: Joi.number().min(0).optional().allow(null, ''),
    fuelVolume: Joi.number().min(0).optional().allow(null, ''),
    comments: Joi.string().optional().allow(null, '')
}).unknown(false);

export const updateTripSchema = Joi.object({
    scheduledDeparture: Joi.date().optional(),
    departureLoc: Joi.string().optional(),
    arrivalLoc: Joi.string().optional(),
    truck: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    driver: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
    startMileage: Joi.number().min(0).optional().allow(null, ''),
    endMileage: Joi.number().min(0).optional().allow(null, ''),
    fuelVolume: Joi.number().min(0).optional().allow(null, ''),
    comments: Joi.string().optional().allow(null, '')
}).unknown(false).min(1);

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').required(),
    startMileage: Joi.number().min(0),
    endMileage: Joi.number().min(0),
    fuelVolume: Joi.number().min(0),
    comments: Joi.string()
});
