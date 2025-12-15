import mongoose from 'mongoose';

const maintenanceRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    intervalValue: {
        type: Number,
        required: true
    },
    conditionType: {
        type: String,
        enum: ['mileage', 'time', 'both'],
        required: true
    },
    targetType: {
        type: String,
        enum: ['truck', 'trailer', 'tire'],
        required: true
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('MaintenanceRule', maintenanceRuleSchema);