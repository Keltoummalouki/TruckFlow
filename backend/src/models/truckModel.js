import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    capacity: { type: Number, required: true },
    mileage: { type: Number, default: 0, min: 0 },
    fuelConsumption: { type: Number, default: 0, min: 0 }, // L/100km
    status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Truck', truckSchema);