import { jest } from '@jest/globals';
import * as maintenanceService from '../../services/maintenanceService.js';
import Maintenance from '../../models/maintenanceModel.js';
import MaintenanceRule from '../../models/maintenanceRuleModel.js';

jest.mock('../../models/maintenanceModel.js');
jest.mock('../../models/maintenanceRuleModel.js');

describe('MaintenanceService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUpcoming', () => {
        it('should return upcoming scheduled maintenance', async () => {
            const mockMaintenance = [
                { _id: '1', status: 'scheduled', date: new Date('2024-12-20') }
            ];

            Maintenance.find = jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockMaintenance)
            });

            const result = await maintenanceService.getUpcoming();

            expect(result).toEqual(mockMaintenance);
        });
    });

    describe('getByTarget', () => {
        it('should return maintenance by target', async () => {
            const targetType = 'Truck';
            const targetId = '123';
            const mockMaintenance = [
                { _id: '1', targetType, targetId }
            ];

            Maintenance.find = jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockMaintenance)
            });

            const result = await maintenanceService.getByTarget(targetType, targetId);

            expect(Maintenance.find).toHaveBeenCalledWith({ targetType, targetId });
            expect(result).toEqual(mockMaintenance);
        });
    });

    describe('createMaintenanceRule', () => {
        it('should create a new maintenance rule', async () => {
            const ruleData = {
                name: 'Oil Change',
                intervalValue: 10000,
                conditionType: 'mileage',
                targetType: 'Truck'
            };

            MaintenanceRule.create = jest.fn().mockResolvedValue({ _id: '123', ...ruleData });

            const result = await maintenanceService.createMaintenanceRule(ruleData);

            expect(MaintenanceRule.create).toHaveBeenCalledWith(ruleData);
            expect(result).toHaveProperty('_id');
        });
    });

    describe('getAllRules', () => {
        it('should return all maintenance rules', async () => {
            const mockRules = [
                { _id: '1', name: 'Oil Change', intervalValue: 10000 },
                { _id: '2', name: 'Tire Rotation', intervalValue: 15000 }
            ];

            MaintenanceRule.find = jest.fn().mockResolvedValue(mockRules);

            const result = await maintenanceService.getAllRules();

            expect(MaintenanceRule.find).toHaveBeenCalled();
            expect(result).toEqual(mockRules);
        });
    });
});
