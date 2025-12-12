import Joi from 'joi';

export const createTripSchema = Joi.object({
    scheduledDeparture: Joi.date().required(),
    departureLoc: Joi.string().required(),
    arrivalLoc: Joi.string().required(),
    truck: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    driver: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled'),
    comments: Joi.string()
});

export const updateTripSchema = Joi.object({
    scheduledDeparture: Joi.date(),
    departureLoc: Joi.string(),
    arrivalLoc: Joi.string(),
    truck: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    driver: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled'),
    startMileage: Joi.number().min(0),
    endMileage: Joi.number().min(0),
    fuelVolume: Joi.number().min(0),
    comments: Joi.string()
});

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').required(),
    startMileage: Joi.number().min(0),
    endMileage: Joi.number().min(0),
    fuelVolume: Joi.number().min(0),
    comments: Joi.string()
});
