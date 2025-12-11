import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ['available', 'in_use', 'maintenance'], default: 'available' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Truck', truckSchema);