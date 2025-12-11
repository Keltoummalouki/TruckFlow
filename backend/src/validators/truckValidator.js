import Joi from 'joi';

export const createTruckSchema = Joi.object({
    licensePlate: Joi.string().required(),
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    capacity: Joi.number().positive().required(),
    status: Joi.string().valid('available', 'in_use', 'maintenance'),
});

export const updateTruckSchema = Joi.object({
    licensePlate: Joi.string(),
    brand: Joi.string(),
    model: Joi.string(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
    capacity: Joi.number().positive(),
    status: Joi.string().valid('available', 'in_use', 'maintenance'),
});

export const assignDriverSchema = Joi.object({
    driverId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'driverId must be a valid ObjectId'
    }),
});
