import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTrailers } from '../../context/TrailerContext';
import useAlert from '../../hooks/useAlert';

const trailerSchema = yup.object().shape({
    licensePlate: yup.string().required('License plate is required').trim(),
    type: yup.string().oneOf(['flatbed', 'refrigerated', 'tanker', 'container', 'box'], 'Invalid type').required('Type is required'),
    capacity: yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1').typeError('Capacity must be a number'),
    mileage: yup.number().min(0, 'Mileage cannot be negative').typeError('Mileage must be a number').nullable(),
    status: yup.string().oneOf(['available', 'in_use', 'maintenance', 'retired'], 'Invalid status').required('Status is required'),
    notes: yup.string().max(500, 'Notes cannot exceed 500 characters').nullable()
});

const TrailerForm = ({ trailer, onSuccess, onCancel }) => {
    const { createTrailer, updateTrailer } = useTrailers();
    const alert = useAlert();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(trailerSchema),
        defaultValues: {
            licensePlate: '',
            type: 'flatbed',
            capacity: '',
            mileage: 0,
            status: 'available',
            notes: ''
        }
    });

    useEffect(() => {
        if (trailer) {
            reset({
                licensePlate: trailer.licensePlate || '',
                type: trailer.type || 'flatbed',
                capacity: trailer.capacity || '',
                mileage: trailer.mileage || 0,
                status: trailer.status || 'available',
                notes: trailer.notes || ''
            });
        }
    }, [trailer, reset]);

    const onSubmit = async (data) => {
        try {
            if (trailer) {
                await updateTrailer(trailer._id, data);
                alert.success('Trailer updated successfully');
            } else {
                await createTrailer(data);
                alert.success('Trailer created successfully');
            }
            onSuccess();
        } catch (error) {
            alert.error(error.message || 'Failed to save trailer');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        placeholder="e.g., TR-1234"
                    />
                    {errors.licensePlate && (
                        <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                        Type *
                    </label>
                    <select
                        id="type"
                        {...register('type')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.type ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="flatbed">Flatbed</option>
                        <option value="refrigerated">Refrigerated</option>
                        <option value="tanker">Tanker</option>
                        <option value="container">Container</option>
                        <option value="box">Box</option>
                    </select>
                    {errors.type && (
                        <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                </div>

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
                        placeholder="e.g., 30000"
                    />
                    {errors.capacity && (
                        <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                    )}
                </div>

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
                        placeholder="e.g., 50000"
                    />
                    {errors.mileage && (
                        <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
                    )}
                </div>

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
                        <option value="available">Available</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                </label>
                <textarea
                    id="notes"
                    rows={3}
                    {...register('notes')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.notes ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Additional notes about this trailer..."
                />
                {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
            </div>

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
                    {isSubmitting ? 'Saving...' : trailer ? 'Update Trailer' : 'Create Trailer'}
                </button>
            </div>
        </form>
    );
};

export default TrailerForm;
