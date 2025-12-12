import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    scheduledDeparture: {
        type: Date,
        required: true
    },
    departureLoc: {
        type: String,
        required: true
    },
    arrivalLoc: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    startMileage: {
        type: Number,
        default: 0
    },
    endMileage: {
        type: Number,
        default: 0
    },
    fuelVolume: {
        type: Number,
        default: 0
    },
    comments: String,
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Trip', tripSchema);
