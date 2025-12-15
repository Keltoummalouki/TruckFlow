import { jest } from '@jest/globals';

const mockTripModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
};

const mockTruckModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
};

const mockTireModel = {
    countDocuments: jest.fn(),
};

jest.unstable_mockModule('../../models/tripModel.js', () => ({
    default: mockTripModel,
}));

jest.unstable_mockModule('../../models/truckModel.js', () => ({
    default: mockTruckModel,
}));

jest.unstable_mockModule('../../models/tireModel.js', () => ({
    default: mockTireModel,
}));

const reportService = await import('../../services/reportService.js');

describe('ReportService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getFuelConsumptionReport', () => {
        it('should return fuel consumption report', async () => {
            const startDate = '2024-01-01';
            const endDate = '2024-12-31';
            const mockTrips = [
                { _id: '1', fuelVolume: 100, startMileage: 1000, endMileage: 1500, truck: {}, driver: {} },
                { _id: '2', fuelVolume: 120, startMileage: 2000, endMileage: 2600, truck: {}, driver: {} }
            ];

            mockTripModel.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTrips)
            });

            const result = await reportService.getFuelConsumptionReport(startDate, endDate);

            expect(result).toHaveProperty('totalFuel');
            expect(result).toHaveProperty('totalDistance');
            expect(result).toHaveProperty('avgConsumption');
        }, 10000);
    });

    describe('getMileageReport', () => {
        it('should return mileage report for all trucks', async () => {
            const mockTrucks = [
                { _id: '1', registrationNumber: 'ABC123', currentMileage: 50000, driver: null },
                { _id: '2', registrationNumber: 'DEF456', currentMileage: 75000, driver: null }
            ];

            mockTruckModel.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTrucks)
            });

            const result = await reportService.getMileageReport();

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty('registrationNumber');
            expect(result[0]).toHaveProperty('currentMileage');
        });
    });

    describe('getFleetOverview', () => {
        it('should return fleet overview statistics', async () => {
            mockTruckModel.countDocuments = jest.fn()
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(5)
                .mockResolvedValueOnce(3)
                .mockResolvedValueOnce(2);

            mockTripModel.countDocuments = jest.fn()
                .mockResolvedValueOnce(50)
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(5)
                .mockResolvedValueOnce(35);

            mockTireModel.countDocuments = jest.fn()
                .mockResolvedValueOnce(100);

            const result = await reportService.getFleetOverview();

            expect(result).toHaveProperty('fleet');
            expect(result).toHaveProperty('trips');
            expect(result).toHaveProperty('tires');
            expect(result.fleet).toHaveProperty('totalTrucks');
            expect(result.trips).toHaveProperty('total');
            expect(result.tires).toHaveProperty('total');
        }, 10000);
    });
});
