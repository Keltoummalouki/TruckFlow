import mongoose from 'mongoose';

const tireSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    size: { type: String, required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    position: { type: String, enum: ['front_left', 'front_right', 'rear_left', 'rear_right', 'spare'], default: 'spare' },
    purchaseDate: { type: Date, required: true },
    installationDate: Date,
    currentMileage: { type: Number, default: 0 },
    maxMileage: { type: Number, required: true },
    status: { type: String, enum: ['new', 'in_use', 'worn', 'damaged', 'retired'], default: 'new' },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    notes: String
}, { timestamps: true });

export default mongoose.model('Tire', tireSchema);
