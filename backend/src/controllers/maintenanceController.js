import * as maintenanceService from '../services/maintenanceService.js';
import { createBaseController } from './baseController.js';

const baseController = createBaseController(maintenanceService);

export const getAll = baseController.getAll;
export const getById = baseController.getById;
export const create = baseController.create;
export const update = baseController.update;
export const deleteMaintenance = async (req, res, next) => {
    try {
        await maintenanceService.deleteMaintenance(req.params.id);
        res.json({ success: true, message: 'Resource deleted' });
    } catch (error) {
        next(error);
    }
};

export const getByTarget = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.params;
        const data = await maintenanceService.getByTarget(targetType, targetId);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getUpcoming = async (req, res, next) => {
    try {
        const data = await maintenanceService.getUpcoming();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const checkNeeded = async (req, res, next) => {
    try {
        const data = await maintenanceService.checkMaintenanceNeeded();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const createRule = async (req, res, next) => {
    try {
        const data = await maintenanceService.createMaintenanceRule(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getAllRules = async (req, res, next) => {
    try {
        const data = await maintenanceService.getAllRules();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const updateRule = async (req, res, next) => {
    try {
        const data = await maintenanceService.updateRule(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const deleteRule = async (req, res, next) => {
    try {
        await maintenanceService.deleteRule(req.params.id);
        res.json({ success: true, message: 'Rule deleted' });
    } catch (error) {
        next(error);
    }
};
