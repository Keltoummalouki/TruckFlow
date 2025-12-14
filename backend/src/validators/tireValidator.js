import Joi from 'joi';

export const createTireSchema = Joi.object({
    serialNumber: Joi.string().required(),
    brand: Joi.string().required(),
    model: Joi.string().required(),
    size: Joi.string().required(),
    position: Joi.string().valid('front_left', 'front_right', 'rear_left', 'rear_right', 'spare').optional(),
    purchaseDate: Joi.date().required(),
    currentMileage: Joi.number().min(0).optional().allow(null, ''),
    maxMileage: Joi.number().positive().required(),
    status: Joi.string().valid('new', 'in_use', 'worn', 'damaged', 'retired').optional(),
    notes: Joi.string().optional().allow(null, '')
}).unknown(false);

export const updateTireSchema = Joi.object({
    serialNumber: Joi.string().optional(),
    brand: Joi.string().optional(),
    model: Joi.string().optional(),
    size: Joi.string().optional(),
    position: Joi.string().valid('front_left', 'front_right', 'rear_left', 'rear_right', 'spare').optional(),
    purchaseDate: Joi.date().optional(),
    currentMileage: Joi.number().min(0).optional().allow(null, ''),
    maxMileage: Joi.number().positive().optional(),
    status: Joi.string().valid('new', 'in_use', 'worn', 'damaged', 'retired').optional(),
    lastMaintenanceDate: Joi.date().optional().allow(null, ''),
    nextMaintenanceDate: Joi.date().optional().allow(null, ''),
    notes: Joi.string().optional().allow(null, '')
}).unknown(false).min(1);

export const assignTireSchema = Joi.object({
    truckId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    position: Joi.string().valid('front_left', 'front_right', 'rear_left', 'rear_right', 'spare').required()
});
