import Joi from 'joi';

export const createMaintenanceSchema = Joi.object({
    type: Joi.string().valid('tire_change', 'oil_change', 'inspection', 'repair', 'other').required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    cost: Joi.number().min(0),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled'),
    targetType: Joi.string().valid('Truck', 'Trailer', 'Tire').required(),
    targetId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    notes: Joi.string()
});

export const updateMaintenanceSchema = Joi.object({
    type: Joi.string().valid('tire_change', 'oil_change', 'inspection', 'repair', 'other'),
    date: Joi.date(),
    description: Joi.string(),
    cost: Joi.number().min(0),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled'),
    notes: Joi.string()
});

export const createRuleSchema = Joi.object({
    name: Joi.string().required(),
    intervalValue: Joi.number().positive().required(),
    conditionType: Joi.string().valid('mileage', 'time', 'both').required(),
    targetType: Joi.string().valid('Truck', 'Trailer', 'Tire').required(),
    description: Joi.string(),
    isActive: Joi.boolean()
});

export const updateRuleSchema = Joi.object({
    name: Joi.string(),
    intervalValue: Joi.number().positive(),
    conditionType: Joi.string().valid('mileage', 'time', 'both'),
    targetType: Joi.string().valid('Truck', 'Trailer', 'Tire'),
    description: Joi.string(),
    isActive: Joi.boolean()
});