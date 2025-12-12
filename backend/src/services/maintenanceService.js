import Maintenance from '../models/maintenanceModel.js';
import MaintenanceRule from '../models/maintenanceRuleModel.js';
import Truck from '../models/truckModel.js';
import Trailer from '../models/trailerModel.js';
import Tire from '../models/tireModel.js';
import { createBaseService } from './baseService.js';

const baseService = createBaseService(Maintenance);

export const getAll = (filter = {}) => baseService.getAll(filter);
export const getById = (id) => baseService.getById(id);
export const create = (data) => baseService.create(data);
export const update = (id, data) => baseService.update(id, data);
export const deleteMaintenance = (id) => baseService.delete(id);

export const getByTarget = async (targetType, targetId) => {
    return await Maintenance.find({ targetType, targetId }).sort({ date: -1 });
};

export const getUpcoming = async () => {
    return await Maintenance.find({
        status: 'scheduled',
        date: { $gte: new Date() }
    }).sort({ date: 1 });
};

export const checkMaintenanceNeeded = async () => {
    const rules = await MaintenanceRule.find({ isActive: true });
    const maintenanceNeeded = [];

    for (const rule of rules) {
        let targets = [];
        
        if (rule.targetType === 'Truck') {
            targets = await Truck.find();
        } else if (rule.targetType === 'Trailer') {
            targets = await Trailer.find();
        } else if (rule.targetType === 'Tire') {
            targets = await Tire.find();
        }

        for (const target of targets) {
            const lastMaintenance = await Maintenance.findOne({
                targetType: rule.targetType,
                targetId: target._id,
                status: 'completed'
            }).sort({ date: -1 });

            let needsMaintenance = false;

            if (rule.conditionType === 'mileage' || rule.conditionType === 'both') {
                const currentMileage = target.currentMileage || 0;
                const lastMileage = lastMaintenance?.targetId?.currentMileage || 0;
                
                if (currentMileage - lastMileage >= rule.intervalValue) {
                    needsMaintenance = true;
                }
            }

            if (rule.conditionType === 'time' || rule.conditionType === 'both') {
                const lastDate = lastMaintenance?.date || target.createdAt;
                const daysSince = Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
                
                if (daysSince >= rule.intervalValue) {
                    needsMaintenance = true;
                }
            }

            if (needsMaintenance) {
                maintenanceNeeded.push({
                    rule: rule.name,
                    targetType: rule.targetType,
                    targetId: target._id,
                    targetName: target.registrationNumber || target.serialNumber || target.licensePlate,
                    description: rule.description
                });
            }
        }
    }

    return maintenanceNeeded;
};

export const createMaintenanceRule = async (data) => {
    return await MaintenanceRule.create(data);
};

export const getAllRules = async () => {
    return await MaintenanceRule.find();
};

export const updateRule = async (id, data) => {
    return await MaintenanceRule.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRule = async (id) => {
    return await MaintenanceRule.findByIdAndDelete(id);
};