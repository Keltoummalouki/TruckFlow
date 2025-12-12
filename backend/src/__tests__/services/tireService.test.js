import { jest } from '@jest/globals';

const mockTireModel = {
    find: jest.fn(),
};

const mockBaseService = {
    update: jest.fn(),
};

jest.unstable_mockModule('../../models/tireModel.js', () => ({
    default: mockTireModel,
}));

jest.unstable_mockModule('../../services/baseService.js', () => ({
    createBaseService: jest.fn(() => mockBaseService),
}));

const tireService = await import('../../services/tireService.js');

describe('TireService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getByStatus', () => {
        it('should return tires by status', async () => {
            const status = 'new';
            const mockTires = [
                { _id: '507f1f77bcf86cd799439011', serialNumber: 'TIRE001', status: 'new' },
                { _id: '507f1f77bcf86cd799439012', serialNumber: 'TIRE002', status: 'new' }
            ];

            mockTireModel.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTires)
            });

            const result = await tireService.getByStatus(status);

            expect(mockTireModel.find).toHaveBeenCalledWith({ status });
            expect(result).toEqual(mockTires);
        });
    });

    describe('assignToTruck', () => {
        it('should assign tire to truck', async () => {
            const tireId = '507f1f77bcf86cd799439011';
            const truckId = '507f1f77bcf86cd799439012';
            const position = 'front_left';
            const mockUpdated = { _id: tireId, truck: truckId, position, status: 'in_use' };

            mockBaseService.update.mockResolvedValue(mockUpdated);

            const result = await tireService.assignToTruck(tireId, truckId, position);

            expect(result).toBeDefined();
            expect(mockBaseService.update).toHaveBeenCalled();
        });
    });

    describe('unassignFromTruck', () => {
        it('should unassign tire from truck', async () => {
            const tireId = '507f1f77bcf86cd799439011';
            const mockUpdated = { _id: tireId, truck: null, position: 'spare', status: 'new' };

            mockBaseService.update.mockResolvedValue(mockUpdated);

            const result = await tireService.unassignFromTruck(tireId);

            expect(result).toBeDefined();
            expect(mockBaseService.update).toHaveBeenCalled();
        });
    });
});
