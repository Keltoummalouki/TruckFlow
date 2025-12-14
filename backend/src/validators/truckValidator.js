import Joi from 'joi';

export const createTruckSchema = Joi.object({
    licensePlate: Joi.string().required(),
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    capacity: Joi.number().positive().required(),
    mileage: Joi.number().min(0).optional().allow(null, ''),
    fuelConsumption: Joi.number().min(0).optional().allow(null, ''),
    status: Joi.string().valid('active', 'maintenance', 'inactive').optional(),
    driver: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().allow(null, ''),
}).unknown(false);

export const updateTruckSchema = Joi.object({
    licensePlate: Joi.string().optional(),
    brand: Joi.string().optional(),
    model: Joi.string().optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
    capacity: Joi.number().positive().optional(),
    mileage: Joi.number().min(0).optional().allow(null, ''),
    fuelConsumption: Joi.number().min(0).optional().allow(null, ''),
    status: Joi.string().valid('active', 'maintenance', 'inactive').optional(),
    driver: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().allow(null, ''),
}).unknown(false).min(1);

export const assignDriverSchema = Joi.object({
    driverId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'driverId must be a valid ObjectId'
    }),
});
