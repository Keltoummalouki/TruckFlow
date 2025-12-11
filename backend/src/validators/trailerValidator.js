import Joi from 'joi';

export const createTrailerSchema = Joi.object({
    licensePlate: Joi.string().required(),
    type: Joi.string().valid('flatbed', 'refrigerated', 'tanker', 'container', 'box').required(),
    capacity: Joi.number().positive().required(),
    currentWeight: Joi.number().min(0).default(0),
    status: Joi.string().valid('available', 'in_use', 'maintenance', 'retired'),
    mileage: Joi.number().min(0).default(0),
    lastMaintenanceDate: Joi.date().allow(null),
    nextMaintenanceDate: Joi.date().allow(null),
    tires: Joi.array().items(
        Joi.object({
            position: Joi.string(),
            brand: Joi.string(),
            model: Joi.string(),
            purchaseDate: Joi.date(),
            mileageAtPurchase: Joi.number().min(0),
            currentMileage: Joi.number().min(0),
            status: Joi.string().valid('good', 'worn', 'damaged'),
        })
    ),
    notes: Joi.string().allow(''),
});

export const updateTrailerSchema = Joi.object({
    licensePlate: Joi.string(),
    type: Joi.string().valid('flatbed', 'refrigerated', 'tanker', 'container', 'box'),
    capacity: Joi.number().positive(),
    currentWeight: Joi.number().min(0),
    status: Joi.string().valid('available', 'in_use', 'maintenance', 'retired'),
    mileage: Joi.number().min(0),
    lastMaintenanceDate: Joi.date().allow(null),
    nextMaintenanceDate: Joi.date().allow(null),
    tires: Joi.array().items(
        Joi.object({
            position: Joi.string(),
            brand: Joi.string(),
            model: Joi.string(),
            purchaseDate: Joi.date(),
            mileageAtPurchase: Joi.number().min(0),
            currentMileage: Joi.number().min(0),
            status: Joi.string().valid('good', 'worn', 'damaged'),
        })
    ),
    notes: Joi.string().allow(''),
});

export const assignTruckSchema = Joi.object({
    truckId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'truckId must be a valid ObjectId'
    }),
});