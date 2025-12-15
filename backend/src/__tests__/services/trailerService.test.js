import { jest } from '@jest/globals';

const mockTrailerModel = {
    find: jest.fn(),
};

const mockBaseService = {
    update: jest.fn(),
};

jest.unstable_mockModule('../../models/trailerModel.js', () => ({
    default: mockTrailerModel,
}));

jest.unstable_mockModule('../../services/baseService.js', () => ({
    createBaseService: jest.fn(() => mockBaseService),
}));

const trailerService = await import('../../services/trailerService.js');

describe('TrailerService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAvailableTrailers', () => {
        it('should return available trailers', async () => {
            const mockTrailers = [
                { _id: '507f1f77bcf86cd799439011', licensePlate: 'REM123', status: 'available' },
                { _id: '507f1f77bcf86cd799439012', licensePlate: 'REM456', status: 'available' }
            ];

            mockTrailerModel.find.mockResolvedValue(mockTrailers);

            const result = await trailerService.getAvailableTrailers();

            expect(mockTrailerModel.find).toHaveBeenCalledWith({ status: 'available' });
            expect(result).toEqual(mockTrailers);
        });
    });

    describe('assignToTruck', () => {
        it('should assign trailer to truck', async () => {
            const trailerId = '507f1f77bcf86cd799439011';
            const truckId = '507f1f77bcf86cd799439012';
            const mockUpdated = { _id: trailerId, truck: truckId, status: 'in_use' };

            mockBaseService.update.mockResolvedValue(mockUpdated);

            const result = await trailerService.assignToTruck(trailerId, truckId);

            expect(result).toBeDefined();
            expect(mockBaseService.update).toHaveBeenCalled();
        });
    });

    describe('unassignFromTruck', () => {
        it('should unassign trailer from truck', async () => {
            const trailerId = '507f1f77bcf86cd799439011';
            const mockUpdated = { _id: trailerId, truck: null, status: 'available' };

            mockBaseService.update.mockResolvedValue(mockUpdated);

            const result = await trailerService.unassignFromTruck(trailerId);

            expect(result).toBeDefined();
            expect(mockBaseService.update).toHaveBeenCalled();
        });
    });
});
