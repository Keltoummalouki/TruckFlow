import { jest } from '@jest/globals';
import * as tripService from '../../services/tripService.js';
import Trip from '../../models/TripModel.js';

jest.mock('../../models/tripModel.js');

describe('TripService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all trips with populated fields', async () => {
            const mockTrips = [
                { _id: '507f1f77bcf86cd799439011', scheduledDeparture: new Date(), truck: {}, driver: {} },
                { _id: '507f1f77bcf86cd799439012', scheduledDeparture: new Date(), truck: {}, driver: {} }
            ];

            Trip.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTrips)
            });

            const result = await tripService.getAll();

            expect(result).toEqual(mockTrips);
        });
    });

    describe('getById', () => {
        it('should return trip by id with populated fields', async () => {
            const tripId = '507f1f77bcf86cd799439011';
            const mockTrip = { _id: tripId, scheduledDeparture: new Date() };

            Trip.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTrip)
            });

            const result = await tripService.getById(tripId);

            expect(result).toEqual(mockTrip);
        });
    });
});
