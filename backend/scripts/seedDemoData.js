import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import models
import User from '../src/models/userModel.js';
import Truck from '../src/models/truckModel.js';
import Trip from '../src/models/tripModel.js';
import Trailer from '../src/models/trailerModel.js';
import Tire from '../src/models/tireModel.js';
import Maintenance from '../src/models/maintenanceModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truckflow';

// Demo data
const trucks = [
    { licensePlate: 'TRK-001', brand: 'Volvo', model: 'FH16', year: 2022, capacity: 25, status: 'active', mileage: 45000, fuelConsumption: 32 },
    { licensePlate: 'TRK-002', brand: 'Scania', model: 'R500', year: 2021, capacity: 22, status: 'active', mileage: 78000, fuelConsumption: 35 },
    { licensePlate: 'TRK-003', brand: 'Mercedes', model: 'Actros', year: 2023, capacity: 28, status: 'active', mileage: 12000, fuelConsumption: 30 },
    { licensePlate: 'TRK-004', brand: 'MAN', model: 'TGX', year: 2020, capacity: 24, status: 'maintenance', mileage: 120000, fuelConsumption: 38 },
    { licensePlate: 'TRK-005', brand: 'DAF', model: 'XF', year: 2022, capacity: 26, status: 'active', mileage: 55000, fuelConsumption: 33 },
    { licensePlate: 'TRK-006', brand: 'Iveco', model: 'S-Way', year: 2021, capacity: 23, status: 'active', mileage: 89000, fuelConsumption: 36 },
    { licensePlate: 'TRK-007', brand: 'Volvo', model: 'FM', year: 2019, capacity: 20, status: 'inactive', mileage: 180000, fuelConsumption: 40 },
    { licensePlate: 'TRK-008', brand: 'Scania', model: 'S730', year: 2023, capacity: 30, status: 'active', mileage: 8000, fuelConsumption: 28 },
];

const trailers = [
    { licensePlate: 'TRL-001', type: 'flatbed', capacity: 25, status: 'available', mileage: 30000, notes: 'Heavy duty flatbed' },
    { licensePlate: 'TRL-002', type: 'refrigerated', capacity: 20, status: 'in_use', mileage: 45000, notes: 'Temperature controlled -20°C to +5°C' },
    { licensePlate: 'TRL-003', type: 'container', capacity: 28, status: 'available', mileage: 22000, notes: '40ft container compatible' },
    { licensePlate: 'TRL-004', type: 'tanker', capacity: 30, status: 'maintenance', mileage: 60000, notes: 'Fuel transport tanker' },
    { licensePlate: 'TRL-005', type: 'box', capacity: 18, status: 'available', mileage: 15000, notes: 'Enclosed box trailer' },
    { licensePlate: 'TRL-006', type: 'flatbed', capacity: 22, status: 'in_use', mileage: 55000, notes: 'Standard flatbed' },
];

const tires = [
    { serialNumber: 'TIRE-001', brand: 'Michelin', model: 'X Multi Z', size: '315/70R22.5', position: 'front_left', purchaseDate: new Date('2024-01-15'), currentMileage: 25000, maxMileage: 150000, status: 'in_use' },
    { serialNumber: 'TIRE-002', brand: 'Michelin', model: 'X Multi Z', size: '315/70R22.5', position: 'front_right', purchaseDate: new Date('2024-01-15'), currentMileage: 25000, maxMileage: 150000, status: 'in_use' },
    { serialNumber: 'TIRE-003', brand: 'Bridgestone', model: 'R-Drive', size: '315/80R22.5', position: 'rear_left', purchaseDate: new Date('2023-10-20'), currentMileage: 45000, maxMileage: 120000, status: 'in_use' },
    { serialNumber: 'TIRE-004', brand: 'Bridgestone', model: 'R-Drive', size: '315/80R22.5', position: 'rear_right', purchaseDate: new Date('2023-10-20'), currentMileage: 45000, maxMileage: 120000, status: 'in_use' },
    { serialNumber: 'TIRE-005', brand: 'Continental', model: 'HDL2', size: '295/80R22.5', position: 'spare', purchaseDate: new Date('2024-03-01'), currentMileage: 0, maxMileage: 130000, status: 'new' },
    { serialNumber: 'TIRE-006', brand: 'Goodyear', model: 'KMAX S', size: '315/70R22.5', position: 'front_left', purchaseDate: new Date('2023-06-10'), currentMileage: 78000, maxMileage: 140000, status: 'worn' },
    { serialNumber: 'TIRE-007', brand: 'Pirelli', model: 'TH01', size: '315/80R22.5', position: 'rear_left', purchaseDate: new Date('2024-02-28'), currentMileage: 12000, maxMileage: 125000, status: 'in_use' },
    { serialNumber: 'TIRE-008', brand: 'Pirelli', model: 'TH01', size: '315/80R22.5', position: 'rear_right', purchaseDate: new Date('2024-02-28'), currentMileage: 12000, maxMileage: 125000, status: 'in_use' },
];

const locations = [
    'Paris, France', 'Berlin, Germany', 'Madrid, Spain', 'Rome, Italy',
    'Amsterdam, Netherlands', 'Brussels, Belgium', 'Vienna, Austria',
    'Warsaw, Poland', 'Prague, Czech Republic', 'Barcelona, Spain',
    'Munich, Germany', 'Milan, Italy', 'Lyon, France', 'Hamburg, Germany'
];

const seedDatabase = async () => {
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Truck.deleteMany({}),
            Trailer.deleteMany({}),
            Tire.deleteMany({}),
            Trip.deleteMany({}),
            Maintenance.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Create trucks
        console.log('🚛 Creating trucks...');
        const createdTrucks = await Truck.insertMany(trucks);
        console.log(`✅ Created ${createdTrucks.length} trucks`);

        // Create trailers
        console.log('🚚 Creating trailers...');
        const createdTrailers = await Trailer.insertMany(trailers);
        console.log(`✅ Created ${createdTrailers.length} trailers`);

        // Create tires and assign to trucks
        console.log('🛞 Creating tires...');
        const tiresWithTrucks = tires.map((tire, index) => ({
            ...tire,
            truck: createdTrucks[index % createdTrucks.length]._id
        }));
        const createdTires = await Tire.insertMany(tiresWithTrucks);
        console.log(`✅ Created ${createdTires.length} tires`);

        // Get or create a driver user
        console.log('👤 Finding/creating driver...');
        let driver = await User.findOne({ role: 'driver' });
        if (!driver) {
            const hashedPassword = await bcrypt.hash('driver123', 10);
            driver = await User.create({
                firstName: 'John',
                lastName: 'Driver',
                email: 'driver@truckflow.com',
                password: hashedPassword,
                role: 'driver',
                status: 'active'
            });
            console.log('✅ Created driver user: driver@truckflow.com / driver123');
        } else {
            console.log('✅ Using existing driver');
        }

        // Create trips
        console.log('🗺️  Creating trips...');
        const tripStatuses = ['pending', 'in_progress', 'completed', 'completed', 'completed'];
        const trips = [];
        for (let i = 0; i < 15; i++) {
            const depLoc = locations[Math.floor(Math.random() * locations.length)];
            let arrLoc = locations[Math.floor(Math.random() * locations.length)];
            while (arrLoc === depLoc) {
                arrLoc = locations[Math.floor(Math.random() * locations.length)];
            }

            const status = tripStatuses[Math.floor(Math.random() * tripStatuses.length)];
            const daysAgo = Math.floor(Math.random() * 30);
            const scheduledDeparture = new Date();
            scheduledDeparture.setDate(scheduledDeparture.getDate() - daysAgo + Math.floor(Math.random() * 10));

            trips.push({
                truck: createdTrucks[Math.floor(Math.random() * createdTrucks.length)]._id,
                driver: driver._id,
                departureLoc: depLoc,
                arrivalLoc: arrLoc,
                scheduledDeparture,
                status,
                startMileage: Math.floor(Math.random() * 50000) + 10000,
                endMileage: status === 'completed' ? Math.floor(Math.random() * 50000) + 60000 : 0,
                fuelVolume: status === 'completed' ? Math.floor(Math.random() * 200) + 100 : 0,
                comments: status === 'completed' ? 'Trip completed successfully' : ''
            });
        }
        const createdTrips = await Trip.insertMany(trips);
        console.log(`✅ Created ${createdTrips.length} trips`);

        // Create maintenance records
        console.log('🔧 Creating maintenance records...');
        const maintenanceTypes = ['oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair'];
        const maintenanceStatuses = ['scheduled', 'in_progress', 'completed', 'completed'];
        const maintenanceRecords = [];

        for (let i = 0; i < 12; i++) {
            const type = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
            const status = maintenanceStatuses[Math.floor(Math.random() * maintenanceStatuses.length)];
            const daysAgo = Math.floor(Math.random() * 60);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            maintenanceRecords.push({
                type,
                targetType: 'Truck',
                targetId: createdTrucks[Math.floor(Math.random() * createdTrucks.length)]._id,
                date,
                description: `${type.replace('_', ' ')} service for fleet vehicle`,
                cost: Math.floor(Math.random() * 500) + 50,
                status,
                notes: status === 'completed' ? 'Work completed successfully' : ''
            });
        }
        const createdMaintenance = await Maintenance.insertMany(maintenanceRecords);
        console.log(`✅ Created ${createdMaintenance.length} maintenance records`);

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   🚛 Trucks: ${createdTrucks.length}`);
        console.log(`   🚚 Trailers: ${createdTrailers.length}`);
        console.log(`   🛞 Tires: ${createdTires.length}`);
        console.log(`   🗺️  Trips: ${createdTrips.length}`);
        console.log(`   🔧 Maintenance: ${createdMaintenance.length}`);
        console.log('\n✨ Ready to demo TruckFlow!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

seedDatabase();
