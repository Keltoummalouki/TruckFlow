import * as reportService from '../services/reportService.js';

export const getFuelConsumption = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await reportService.getFuelConsumptionReport(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getMileage = async (req, res, next) => {
    try {
        const data = await reportService.getMileageReport();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getDriverPerformance = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await reportService.getDriverPerformanceReport(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getTireStatus = async (req, res, next) => {
    try {
        const data = await reportService.getTireStatusReport();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getFleetOverview = async (req, res, next) => {
    try {
        const data = await reportService.getFleetOverview();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
