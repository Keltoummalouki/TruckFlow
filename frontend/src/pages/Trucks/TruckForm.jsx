import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTrucks } from '../../context/TruckContext';
import useAlert from '../../hooks/useAlert';

// Validation schema
const truckSchema = yup.object().shape({
    licensePlate: yup
        .string()
        .required('License plate is required')
        .trim()
        .min(3, 'License plate must be at least 3 characters'),
    brand: yup
        .string()
        .required('Brand is required')
        .trim(),
    model: yup
        .string()
        .required('Model is required')
        .trim(),
    year: yup
        .number()
        .required('Year is required')
        .min(1900, 'Year must be 1900 or later')
        .max(new Date().getFullYear() + 1, 'Year cannot be in the future')
        .typeError('Year must be a number'),
    capacity: yup
        .number()
        .required('Capacity is required')
        .min(1, 'Capacity must be at least 1')
        .typeError('Capacity must be a number'),
    mileage: yup
        .number()
        .min(0, 'Mileage cannot be negative')
        .typeError('Mileage must be a number')
        .nullable(),
    fuelConsumption: yup
        .number()
        .min(0, 'Fuel consumption cannot be negative')
        .typeError('Fuel consumption must be a number')
        .nullable(),
    status: yup
        .string()
        .oneOf(['active', 'maintenance', 'inactive'], 'Invalid status')
        .required('Status is required')
});

const TruckForm = ({ truck, onSuccess, onCancel }) => {
    const { createTruck, updateTruck } = useTrucks();
    const alert = useAlert();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(truckSchema),
        defaultValues: {
            licensePlate: '',
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            capacity: '',
            mileage: 0,
            fuelConsumption: 0,
            status: 'active'
        }
    });

    // Populate form when editing
    useEffect(() => {
        if (truck) {
            reset({
                licensePlate: truck.licensePlate || '',
                brand: truck.brand || '',
                model: truck.model || '',
                year: truck.year || new Date().getFullYear(),
                capacity: truck.capacity || '',
                mileage: truck.mileage || 0,
                fuelConsumption: truck.fuelConsumption || 0,
                status: truck.status || 'active'
            });
        }
    }, [truck, reset]);

    const onSubmit = async (data) => {
        try {
            if (truck) {
                // Update existing truck
                await updateTruck(truck._id, data);
                alert.success('Truck updated successfully');
            } else {
                // Create new truck
                await createTruck(data);
                alert.success('Truck created successfully');
            }
            onSuccess();
        } catch (error) {
            alert.error(error.message || 'Failed to save truck');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License Plate */}
                <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                        License Plate *
                    </label>
                    <input
                        type="text"
                        id="licensePlate"
                        {...register('licensePlate')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.licensePlate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., ABC-1234"
                    />
                    {errors.licensePlate && (
                        <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
                    )}
                </div>

                {/* Brand */}
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                        Brand *
                    </label>
                    <input
                        type="text"
                        id="brand"
                        {...register('brand')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.brand ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Volvo"
                    />
                    {errors.brand && (
                        <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                    )}
                </div>

                {/* Model */}
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                        Model *
                    </label>
                    <input
                        type="text"
                        id="model"
                        {...register('model')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.model ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., FH16"
                    />
                    {errors.model && (
                        <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                    )}
                </div>

                {/* Year */}
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                        Year *
                    </label>
                    <input
                        type="number"
                        id="year"
                        {...register('year')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.year ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., 2022"
                    />
                    {errors.year && (
                        <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                    )}
                </div>

                {/* Capacity */}
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity (kg) *
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        {...register('capacity')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.capacity ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., 25000"
                    />
                    {errors.capacity && (
                        <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                    )}
                </div>

                {/* Mileage */}
                <div>
                    <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Mileage (km)
                    </label>
                    <input
                        type="number"
                        id="mileage"
                        {...register('mileage')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.mileage ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., 150000"
                    />
                    {errors.mileage && (
                        <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
                    )}
                </div>

                {/* Fuel Consumption */}
                <div>
                    <label htmlFor="fuelConsumption" className="block text-sm font-medium text-gray-700 mb-2">
                        Fuel Consumption (L/100km)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        id="fuelConsumption"
                        {...register('fuelConsumption')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fuelConsumption ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., 28.5"
                    />
                    {errors.fuelConsumption && (
                        <p className="mt-1 text-sm text-red-600">{errors.fuelConsumption.message}</p>
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
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                </div>
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
                    {isSubmitting ? 'Saving...' : truck ? 'Update Truck' : 'Create Truck'}
                </button>
            </div>
        </form>
    );
};

export default TruckForm;
