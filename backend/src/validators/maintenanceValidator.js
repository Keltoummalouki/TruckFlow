import Joi from 'joi';

export const createMaintenanceSchema = Joi.object({
    type: Joi.string().valid('tire_change', 'oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other').required(),
    date: Joi.date().required(),
    description: Joi.string().required(),
    cost: Joi.number().min(0).optional(),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').optional(),
    targetType: Joi.string().valid('Truck', 'Trailer', 'Tire', 'truck', 'trailer', 'tire').required(),
    targetId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    truck: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(), // Allow truck field (will be mapped to targetId)
    nextDueDate: Joi.date().optional().allow(null, ''),
    nextDueMileage: Joi.number().min(0).optional().allow(null, ''),
    notes: Joi.string().optional().allow(null, '')
}).unknown(false);

export const updateMaintenanceSchema = Joi.object({
    type: Joi.string().valid('tire_change', 'oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other').optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional(),
    cost: Joi.number().min(0).optional(),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').optional(),
    targetType: Joi.string().valid('Truck', 'Trailer', 'Tire', 'truck', 'trailer', 'tire').optional(),
    targetId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    truck: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    nextDueDate: Joi.date().optional().allow(null, ''),
    nextDueMileage: Joi.number().min(0).optional().allow(null, ''),
    notes: Joi.string().optional().allow(null, '')
}).unknown(false).min(1);

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