// backend/src/models/trailerModel.js
import mongoose from 'mongoose';

const trailerSchema = new mongoose.Schema(
{
    licensePlate: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    type: {
        type: String,
        enum: ['flatbed', 'refrigerated', 'tanker', 'container', 'box'],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 0,
    },
    currentWeight: {
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: String,
        enum: ['available', 'in_use', 'maintenance', 'retired'],
        default: 'available',
    },
    mileage: {
        type: Number,
        default: 0,
        min: 0,
    },
    lastMaintenanceDate: {
        type: Date,
        default: null,
    },
    nextMaintenanceDate: {
        type: Date,
        default: null,
    },
    tires: [
    {
        position: String,
        brand: String,
        model: String,
        purchaseDate: Date,
        mileageAtPurchase: Number,
        currentMileage: Number,
        status: {
        type: String,
        enum: ['good', 'worn', 'damaged'],
        default: 'good',
        },
    },
    ],
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        default: null,
    },
    notes: {
        type: String,
        default: '',
    },
},
{ timestamps: true }
);

const Trailer = mongoose.model('Trailer', trailerSchema);

export default Trailer;
