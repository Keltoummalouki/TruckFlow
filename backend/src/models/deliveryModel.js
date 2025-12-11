import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    deliveryNumber: {
        type: String,
        required: true,
        unique: true
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    origin: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    destination: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    cargo: {
        description: { type: String, required: true },
        weight: { type: Number, required: true },
        volume: { type: Number }
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    actualStartDate: Date,
    actualEndDate: Date,
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    distance: Number,
    estimatedDuration: Number,
    notes: String
}, {
    timestamps: true
});

export default mongoose.model('Delivery', deliverySchema);