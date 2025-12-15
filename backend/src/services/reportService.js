import Trip from '../models/tripModel.js';
import Truck from '../models/truckModel.js';
import Tire from '../models/tireModel.js';

export const getFuelConsumptionReport = async (startDate, endDate) => {
    const trips = await Trip.find({
        status: 'completed',
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('truck driver');

    const totalFuel = trips.reduce((sum, trip) => sum + (trip.fuelVolume || 0), 0);
    const totalDistance = trips.reduce((sum, trip) => sum + ((trip.endMileage || 0) - (trip.startMileage || 0)), 0);
    const avgConsumption = totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0;

    return {
        totalFuel,
        totalDistance,
        avgConsumption,
        tripCount: trips.length,
        trips: trips.map(t => ({
            id: t._id,
            truck: t.truck?.registrationNumber,
            driver: `${t.driver?.firstName} ${t.driver?.lastName}`,
            distance: (t.endMileage || 0) - (t.startMileage || 0),
            fuel: t.fuelVolume,
            consumption: ((t.fuelVolume / ((t.endMileage || 0) - (t.startMileage || 0))) * 100).toFixed(2)
        }))
    };
};

export const getMileageReport = async () => {
    const trucks = await Truck.find().populate('driver');
    
    return trucks.map(truck => ({
        id: truck._id,
        registrationNumber: truck.registrationNumber,
        currentMileage: truck.currentMileage,
        status: truck.status,
        driver: truck.driver ? `${truck.driver.firstName} ${truck.driver.lastName}` : 'Unassigned'
    }));
};

export const getDriverPerformanceReport = async (startDate, endDate) => {
    const trips = await Trip.aggregate([
        {
            $match: {
                status: 'completed',
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }
        },
        {
            $group: {
                _id: '$driver',
                tripCount: { $sum: 1 },
                totalDistance: { $sum: { $subtract: ['$endMileage', '$startMileage'] } },
                totalFuel: { $sum: '$fuelVolume' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'driverInfo'
            }
        },
        {
            $unwind: '$driverInfo'
        }
    ]);

    return trips.map(t => ({
        driverId: t._id,
        driverName: `${t.driverInfo.firstName} ${t.driverInfo.lastName}`,
        tripCount: t.tripCount,
        totalDistance: t.totalDistance,
        totalFuel: t.totalFuel,
        avgConsumption: t.totalDistance > 0 ? ((t.totalFuel / t.totalDistance) * 100).toFixed(2) : 0
    }));
};

export const getTireStatusReport = async () => {
    const tires = await Tire.find().populate('truck');
    
    const statusCount = {
        new: 0,
        in_use: 0,
        worn: 0,
        damaged: 0,
        retired: 0
    };

    tires.forEach(tire => {
        statusCount[tire.status]++;
    });

    return {
        statusCount,
        tires: tires.map(t => ({
            id: t._id,
            serialNumber: t.serialNumber,
            brand: t.brand,
            status: t.status,
            currentMileage: t.currentMileage,
            maxMileage: t.maxMileage,
            wearPercentage: ((t.currentMileage / t.maxMileage) * 100).toFixed(2),
            truck: t.truck?.registrationNumber || 'Not assigned'
        }))
    };
};

export const getFleetOverview = async () => {
    const [trucks, trips, tires] = await Promise.all([
        Truck.countDocuments(),
        Trip.countDocuments(),
        Tire.countDocuments()
    ]);

    const [availableTrucks, inUseTrucks, maintenanceTrucks] = await Promise.all([
        Truck.countDocuments({ status: 'available' }),
        Truck.countDocuments({ status: 'in_use' }),
        Truck.countDocuments({ status: 'maintenance' })
    ]);

    const [pendingTrips, inProgressTrips, completedTrips] = await Promise.all([
        Trip.countDocuments({ status: 'pending' }),
        Trip.countDocuments({ status: 'in_progress' }),
        Trip.countDocuments({ status: 'completed' })
    ]);

    return {
        fleet: {
            totalTrucks: trucks,
            available: availableTrucks,
            inUse: inUseTrucks,
            maintenance: maintenanceTrucks
        },
        trips: {
            total: trips,
            pending: pendingTrips,
            inProgress: inProgressTrips,
            completed: completedTrips
        },
        tires: {
            total: tires
        }
    };
};
