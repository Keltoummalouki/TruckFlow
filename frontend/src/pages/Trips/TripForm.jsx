import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTrips } from '../../context/TripContext';
import { getAvailableTrucks } from '../../api/truckApi';
import { getDrivers } from '../../api/driverApi';
import useAlert from '../../hooks/useAlert';

// Validation schema
const tripSchema = yup.object().shape({
    truck: yup
        .string()
        .required('Truck is required'),
    driver: yup
        .string()
        .required('Driver is required'),
    departureLoc: yup
        .string()
        .required('Departure location is required')
        .trim(),
    arrivalLoc: yup
        .string()
        .required('Arrival location is required')
        .trim(),
    scheduledDeparture: yup
        .string()
        .required('Scheduled departure is required'),
    status: yup
        .string()
        .oneOf(['pending', 'in_progress', 'completed', 'cancelled'], 'Invalid status')
        .required('Status is required'),
    startMileage: yup
        .number()
        .min(0, 'Start mileage cannot be negative')
        .typeError('Start mileage must be a number')
        .nullable(),
    endMileage: yup
        .number()
        .min(0, 'End mileage cannot be negative')
        .when('startMileage', ([startMileage], schema) => {
            return startMileage != null
                ? schema.min(startMileage, 'End mileage must be greater than start mileage')
                : schema;
        })
        .typeError('End mileage must be a number')
        .nullable(),
    fuelVolume: yup
        .number()
        .min(0, 'Fuel volume cannot be negative')
        .typeError('Fuel volume must be a number')
        .nullable(),
    comments: yup
        .string()
        .max(500, 'Comments cannot exceed 500 characters')
        .nullable()
});

const TripForm = ({ trip, onSuccess, onCancel }) => {
    const { createTrip, updateTrip } = useTrips();
    const alert = useAlert();

    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm({
        resolver: yupResolver(tripSchema),
        defaultValues: {
            truck: '',
            driver: '',
            departureLoc: '',
            arrivalLoc: '',
            scheduledDeparture: '',
            status: 'pending',
            startMileage: 0,
            endMileage: 0,
            fuelVolume: 0,
            comments: ''
        }
    });

    // Watch status to conditionally show fields
    const status = watch('status');

    // Load trucks and drivers on mount
    useEffect(() => {
        loadOptions();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (trip) {
            reset({
                truck: trip.truck?._id || trip.truck || '',
                driver: trip.driver?._id || trip.driver || '',
                departureLoc: trip.departureLoc || '',
                arrivalLoc: trip.arrivalLoc || '',
                scheduledDeparture: trip.scheduledDeparture
                    ? new Date(trip.scheduledDeparture).toISOString().slice(0, 16)
                    : '',
                status: trip.status || 'pending',
                startMileage: trip.startMileage || 0,
                endMileage: trip.endMileage || 0,
                fuelVolume: trip.fuelVolume || 0,
                comments: trip.comments || ''
            });
        }
    }, [trip, reset]);

    const loadOptions = async () => {
        setLoadingOptions(true);
        try {
            // Load trucks and drivers concurrently
            const [trucksResponse, driversResponse] = await Promise.all([
                getAvailableTrucks(),
                getDrivers({ limit: 100 }) // Get all active drivers
            ]);

            setTrucks(trucksResponse.data || []);
            setDrivers(driversResponse.data || []);
        } catch (error) {
            alert.error('Failed to load trucks and drivers');
        } finally {
            setLoadingOptions(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (trip) {
                // Update existing trip
                await updateTrip(trip._id, data);
                alert.success('Trip updated successfully');
            } else {
                // Create new trip
                await createTrip(data);
                alert.success('Trip created successfully');
            }
            onSuccess();
        } catch (error) {
            alert.error(error.message || 'Failed to save trip');
        }
    };

    if (loadingOptions) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Truck Selection */}
                <div>
                    <label htmlFor="truck" className="block text-sm font-medium text-gray-700 mb-2">
                        Truck *
                    </label>
                    <select
                        id="truck"
                        {...register('truck')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.truck ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select a truck</option>
                        {trucks.map((truck) => (
                            <option key={truck._id} value={truck._id}>
                                {truck.licensePlate} - {truck.brand} {truck.model}
                            </option>
                        ))}
                    </select>
                    {errors.truck && (
                        <p className="mt-1 text-sm text-red-600">{errors.truck.message}</p>
                    )}
                </div>

                {/* Driver Selection */}
                <div>
                    <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-2">
                        Driver *
                    </label>
                    <select
                        id="driver"
                        {...register('driver')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.driver ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                            <option key={driver._id} value={driver._id}>
                                {driver.firstName} {driver.lastName} {driver.email ? `(${driver.email})` : ''}
                            </option>
                        ))}
                    </select>
                    {errors.driver && (
                        <p className="mt-1 text-sm text-red-600">{errors.driver.message}</p>
                    )}
                </div>

                {/* Departure Location */}
                <div>
                    <label htmlFor="departureLoc" className="block text-sm font-medium text-gray-700 mb-2">
                        Departure Location *
                    </label>
                    <input
                        type="text"
                        id="departureLoc"
                        {...register('departureLoc')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.departureLoc ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Paris, France"
                    />
                    {errors.departureLoc && (
                        <p className="mt-1 text-sm text-red-600">{errors.departureLoc.message}</p>
                    )}
                </div>

                {/* Arrival Location */}
                <div>
                    <label htmlFor="arrivalLoc" className="block text-sm font-medium text-gray-700 mb-2">
                        Arrival Location *
                    </label>
                    <input
                        type="text"
                        id="arrivalLoc"
                        {...register('arrivalLoc')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.arrivalLoc ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Lyon, France"
                    />
                    {errors.arrivalLoc && (
                        <p className="mt-1 text-sm text-red-600">{errors.arrivalLoc.message}</p>
                    )}
                </div>

                {/* Scheduled Departure */}
                <div>
                    <label htmlFor="scheduledDeparture" className="block text-sm font-medium text-gray-700 mb-2">
                        Scheduled Departure *
                    </label>
                    <input
                        type="datetime-local"
                        id="scheduledDeparture"
                        {...register('scheduledDeparture')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.scheduledDeparture ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.scheduledDeparture && (
                        <p className="mt-1 text-sm text-red-600">{errors.scheduledDeparture.message}</p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                    </label>
                    <select
                        id="status"
                        {...register('status')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.status ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                </div>

                {/* Start Mileage - Show for in_progress or completed */}
                {(status === 'in_progress' || status === 'completed') && (
                    <div>
                        <label htmlFor="startMileage" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Mileage (km)
                        </label>
                        <input
                            type="number"
                            id="startMileage"
                            {...register('startMileage')}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startMileage ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="e.g., 150000"
                        />
                        {errors.startMileage && (
                            <p className="mt-1 text-sm text-red-600">{errors.startMileage.message}</p>
                        )}
                    </div>
                )}

                {/* End Mileage - Show for completed */}
                {status === 'completed' && (
                    <div>
                        <label htmlFor="endMileage" className="block text-sm font-medium text-gray-700 mb-2">
                            End Mileage (km)
                        </label>
                        <input
                            type="number"
                            id="endMileage"
                            {...register('endMileage')}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.endMileage ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="e.g., 150500"
                        />
                        {errors.endMileage && (
                            <p className="mt-1 text-sm text-red-600">{errors.endMileage.message}</p>
                        )}
                    </div>
                )}

                {/* Fuel Volume - Show for completed */}
                {status === 'completed' && (
                    <div>
                        <label htmlFor="fuelVolume" className="block text-sm font-medium text-gray-700 mb-2">
                            Fuel Consumed (liters)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            id="fuelVolume"
                            {...register('fuelVolume')}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fuelVolume ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="e.g., 120.5"
                        />
                        {errors.fuelVolume && (
                            <p className="mt-1 text-sm text-red-600">{errors.fuelVolume.message}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Comments - Full width */}
            <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                    Comments / Notes
                </label>
                <textarea
                    id="comments"
                    rows={3}
                    {...register('comments')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.comments ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Additional notes about this trip..."
                />
                {errors.comments && (
                    <p className="mt-1 text-sm text-red-600">{errors.comments.message}</p>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : trip ? 'Update Trip' : 'Create Trip'}
                </button>
            </div>
        </form>
    );
};

export default TripForm;
