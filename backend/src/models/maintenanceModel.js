import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['tire_change', 'oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    targetType: {
        type: String,
        enum: ['Truck', 'Trailer', 'Tire'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetType',
        required: true
    },
    notes: String
}, {
    timestamps: true
});

export default mongoose.model('Maintenance', maintenanceSchema);