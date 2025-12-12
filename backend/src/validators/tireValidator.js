import Joi from 'joi';

export const createTireSchema = Joi.object({
    serialNumber: Joi.string().required(),
    brand: Joi.string().required(),
    model: Joi.string().required(),
    size: Joi.string().required(),
    purchaseDate: Joi.date().required(),
    maxMileage: Joi.number().positive().required(),
    status: Joi.string().valid('new', 'in_use', 'worn', 'damaged', 'retired'),
    notes: Joi.string()
});

export const updateTireSchema = Joi.object({
    serialNumber: Joi.string(),
    brand: Joi.string(),
    model: Joi.string(),
    size: Joi.string(),
    currentMileage: Joi.number().min(0),
    maxMileage: Joi.number().positive(),
    status: Joi.string().valid('new', 'in_use', 'worn', 'damaged', 'retired'),
    lastMaintenanceDate: Joi.date(),
    nextMaintenanceDate: Joi.date(),
    notes: Joi.string()
});

export const assignTireSchema = Joi.object({
    truckId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    position: Joi.string().valid('front_left', 'front_right', 'rear_left', 'rear_right', 'spare').required()
});
