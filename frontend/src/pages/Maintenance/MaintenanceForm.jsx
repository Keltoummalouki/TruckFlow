import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMaintenances } from '../../context/MaintenanceContext';
import { getAvailableTrucks } from '../../api/truckApi';
import { getTrailers } from '../../api/trailerApi';
import { getTires } from '../../api/tireApi';
import useAlert from '../../hooks/useAlert';

const maintenanceSchema = yup.object().shape({
    type: yup.string().oneOf(['oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other'], 'Invalid type').required('Type is required'),
    targetType: yup.string().oneOf(['truck', 'trailer', 'tire'], 'Invalid target type').required('Target type is required'),
    truck: yup.string().when('targetType', {
        is: 'truck',
        then: (schema) => schema.required('Truck selection is required'),
        otherwise: (schema) => schema.nullable()
    }),
    trailer: yup.string().when('targetType', {
        is: 'trailer',
        then: (schema) => schema.required('Trailer selection is required'),
        otherwise: (schema) => schema.nullable()
    }),
    tire: yup.string().when('targetType', {
        is: 'tire',
        then: (schema) => schema.required('Tire selection is required'),
        otherwise: (schema) => schema.nullable()
    }),
    date: yup.string().required('Date is required'),
    description: yup.string().required('Description is required').max(500, 'Description cannot exceed 500 characters'),
    cost: yup.number().required('Cost is required').min(0, 'Cost cannot be negative').typeError('Cost must be a number'),
    status: yup.string().oneOf(['scheduled', 'in_progress', 'completed', 'cancelled'], 'Invalid status').required('Status is required'),
    nextDueDate: yup.string().nullable(),
    nextDueMileage: yup.number().min(0, 'Mileage cannot be negative').nullable().typeError('Mileage must be a number')
});

const MaintenanceForm = ({ maintenance, onSuccess, onCancel }) => {
    const { createMaintenance, updateMaintenance } = useMaintenances();
    const alert = useAlert();
    const [trucks, setTrucks] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [tires, setTires] = useState([]);
    const [loadingTrucks, setLoadingTrucks] = useState(false);
    const [loadingTrailers, setLoadingTrailers] = useState(false);
    const [loadingTires, setLoadingTires] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
        resolver: yupResolver(maintenanceSchema),
        defaultValues: {
            type: 'oil_change',
            targetType: 'truck',
            truck: '',
            trailer: '',
            tire: '',
            date: '',
            description: '',
            cost: '',
            status: 'scheduled',
            nextDueDate: '',
            nextDueMileage: ''
        }
    });

    const targetType = watch('targetType');

    useEffect(() => {
        if (targetType === 'truck') {
            loadTrucks();
        } else if (targetType === 'trailer') {
            loadTrailers();
        } else if (targetType === 'tire') {
            loadTires();
        }
    }, [targetType, loadTrucks, loadTrailers, loadTires]);

    useEffect(() => {
        if (maintenance) {
            reset({
                type: maintenance.type || 'oil_change',
                targetType: maintenance.targetType || 'truck',
                truck: maintenance.truck?._id || maintenance.truck || '',
                date: maintenance.date ? new Date(maintenance.date).toISOString().split('T')[0] : '',
                description: maintenance.description || '',
                cost: maintenance.cost || '',
                status: maintenance.status || 'scheduled',
                nextDueDate: maintenance.nextDueDate ? new Date(maintenance.nextDueDate).toISOString().split('T')[0] : '',
                nextDueMileage: maintenance.nextDueMileage || ''
            });
        }
    }, [maintenance, reset]);

    const loadTrucks = async () => {
        setLoadingTrucks(true);
        try {
            const response = await getAvailableTrucks();
            setTrucks(response.data || []);
        } catch {
            alert.error('Failed to load trucks');
        } finally {
            setLoadingTrucks(false);
        }
    };

    const loadTrailers = async () => {
        setLoadingTrailers(true);
        try {
            const response = await getTrailers({ limit: 100 });
            setTrailers(response.data || []);
        } catch {
            alert.error('Failed to load trailers');
        } finally {
            setLoadingTrailers(false);
        }
    };

    const loadTires = async () => {
        setLoadingTires(true);
        try {
            const response = await getTires({ limit: 100 });
            setTires(response.data || []);
        } catch {
            alert.error('Failed to load tires');
        } finally {
            setLoadingTires(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            // Determine targetId based on targetType
            let targetId = null;
            if (data.targetType === 'truck') {
                targetId = data.truck;
                if (!targetId) {
                    alert.error('Please select a truck');
                    return;
                }
            } else if (data.targetType === 'trailer') {
                targetId = data.trailer;
                if (!targetId) {
                    alert.error('Please select a trailer');
                    return;
                }
            } else if (data.targetType === 'tire') {
                targetId = data.tire;
                if (!targetId) {
                    alert.error('Please select a tire');
                    return;
                }
            }

            // Map frontend data to backend format
            const submitData = {
                type: data.type,
                targetType: data.targetType.charAt(0).toUpperCase() + data.targetType.slice(1), // Capitalize
                targetId: targetId,
                date: data.date,
                description: data.description,
                cost: parseFloat(data.cost) || 0,
                status: data.status,
            };

            // Only add optional fields if they have values
            if (data.nextDueDate) {
                submitData.nextDueDate = data.nextDueDate;
            }
            if (data.nextDueMileage) {
                submitData.nextDueMileage = parseInt(data.nextDueMileage);
            }

            if (maintenance) {
                await updateMaintenance(maintenance._id, submitData);
                alert.success('Maintenance record updated successfully');
            } else {
                await createMaintenance(submitData);
                alert.success('Maintenance record created successfully');
            }
            onSuccess();
        } catch (error) {
            console.error('Maintenance form error:', error);
            alert.error(error.message || 'Failed to save maintenance record');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select {...register('type')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="oil_change">Oil Change</option>
                        <option value="tire_rotation">Tire Rotation</option>
                        <option value="brake_service">Brake Service</option>
                        <option value="inspection">Inspection</option>
                        <option value="repair">Repair</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Type *</label>
                    <select {...register('targetType')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.targetType ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="truck">Truck</option>
                        <option value="trailer">Trailer</option>
                        <option value="tire">Tire</option>
                    </select>
                    {errors.targetType && <p className="mt-1 text-sm text-red-600">{errors.targetType.message}</p>}
                </div>

                {targetType === 'truck' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Truck *</label>
                        <select {...register('truck')} disabled={loadingTrucks} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.truck ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select a truck</option>
                            {trucks.map((truck) => (
                                <option key={truck._id} value={truck._id}>{truck.licensePlate} - {truck.brand} {truck.model}</option>
                            ))}
                        </select>
                        {errors.truck && <p className="mt-1 text-sm text-red-600">{errors.truck.message}</p>}
                    </div>
                )}

                {targetType === 'trailer' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trailer *</label>
                        <select {...register('trailer')} disabled={loadingTrailers} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.trailer ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select a trailer</option>
                            {trailers.map((trailer) => (
                                <option key={trailer._id} value={trailer._id}>{trailer.licensePlate} - {trailer.type}</option>
                            ))}
                        </select>
                        {errors.trailer && <p className="mt-1 text-sm text-red-600">{errors.trailer.message}</p>}
                    </div>
                )}

                {targetType === 'tire' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tire *</label>
                        <select {...register('tire')} disabled={loadingTires} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.tire ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select a tire</option>
                            {tires.map((tire) => (
                                <option key={tire._id} value={tire._id}>{tire.serialNumber} - {tire.brand} {tire.model}</option>
                            ))}
                        </select>
                        {errors.tire && <p className="mt-1 text-sm text-red-600">{errors.tire.message}</p>}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input type="date" {...register('date')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($) *</label>
                    <input type="number" step="0.01" {...register('cost')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.cost ? 'border-red-500' : 'border-gray-300'}`} placeholder="0.00" />
                    {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select {...register('status')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Due Date</label>
                    <input type="date" {...register('nextDueDate')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.nextDueDate ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.nextDueDate && <p className="mt-1 text-sm text-red-600">{errors.nextDueDate.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Due Mileage (km)</label>
                    <input type="number" {...register('nextDueMileage')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.nextDueMileage ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 150000" />
                    {errors.nextDueMileage && <p className="mt-1 text-sm text-red-600">{errors.nextDueMileage.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea rows={3} {...register('description')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Describe the maintenance work..." />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : maintenance ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default MaintenanceForm;
