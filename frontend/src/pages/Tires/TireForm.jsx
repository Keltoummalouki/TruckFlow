import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTires } from '../../context/TireContext';
import useAlert from '../../hooks/useAlert';

const tireSchema = yup.object().shape({
    serialNumber: yup.string().required('Serial number is required').trim(),
    brand: yup.string().required('Brand is required').trim(),
    model: yup.string().required('Model is required').trim(),
    size: yup.string().required('Size is required'),
    position: yup.string().oneOf(['front_left', 'front_right', 'rear_left', 'rear_right', 'spare'], 'Invalid position').required('Position is required'),
    purchaseDate: yup.string().required('Purchase date is required'),
    currentMileage: yup.number().min(0, 'Mileage cannot be negative').typeError('Mileage must be a number').nullable(),
    maxMileage: yup.number().required('Max mileage is required').min(1, 'Max mileage must be at least 1').typeError('Max mileage must be a number'),
    status: yup.string().oneOf(['new', 'in_use', 'worn', 'damaged', 'retired'], 'Invalid status').required('Status is required'),
    notes: yup.string().max(500, 'Notes cannot exceed 500 characters').nullable()
});

const TireForm = ({ tire, onSuccess, onCancel }) => {
    const { createTire, updateTire } = useTires();
    const alert = useAlert();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: yupResolver(tireSchema),
        defaultValues: {
            serialNumber: '',
            brand: '',
            model: '',
            size: '',
            position: 'spare',
            purchaseDate: '',
            currentMileage: 0,
            maxMileage: '',
            status: 'new',
            notes: ''
        }
    });

    useEffect(() => {
        if (tire) {
            reset({
                serialNumber: tire.serialNumber || '',
                brand: tire.brand || '',
                model: tire.model || '',
                size: tire.size || '',
                position: tire.position || 'spare',
                purchaseDate: tire.purchaseDate ? new Date(tire.purchaseDate).toISOString().split('T')[0] : '',
                currentMileage: tire.currentMileage || 0,
                maxMileage: tire.maxMileage || '',
                status: tire.status || 'new',
                notes: tire.notes || ''
            });
        }
    }, [tire, reset]);

    const onSubmit = async (data) => {
        try {
            if (tire) {
                await updateTire(tire._id, data);
                alert.success('Tire updated successfully');
            } else {
                await createTire(data);
                alert.success('Tire created successfully');
            }
            onSuccess();
        } catch (error) {
            alert.error(error.message || 'Failed to save tire');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number *</label>
                    <input type="text" {...register('serialNumber')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.serialNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., TIRE-001" />
                    {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                    <input type="text" {...register('brand')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Michelin" />
                    {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input type="text" {...register('model')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.model ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., XZE" />
                    {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                    <input type="text" {...register('size')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.size ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 295/80R22.5" />
                    {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                    <select {...register('position')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.position ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="front_left">Front Left</option>
                        <option value="front_right">Front Right</option>
                        <option value="rear_left">Rear Left</option>
                        <option value="rear_right">Rear Right</option>
                        <option value="spare">Spare</option>
                    </select>
                    {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
                    <input type="date" {...register('purchaseDate')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.purchaseDate ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.purchaseDate && <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Mileage (km)</label>
                    <input type="number" {...register('currentMileage')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.currentMileage ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
                    {errors.currentMileage && <p className="mt-1 text-sm text-red-600">{errors.currentMileage.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Mileage (km) *</label>
                    <input type="number" {...register('maxMileage')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.maxMileage ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 100000" />
                    {errors.maxMileage && <p className="mt-1 text-sm text-red-600">{errors.maxMileage.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select {...register('status')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="new">New</option>
                        <option value="in_use">In Use</option>
                        <option value="worn">Worn</option>
                        <option value="damaged">Damaged</option>
                        <option value="retired">Retired</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea rows={3} {...register('notes')} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.notes ? 'border-red-500' : 'border-gray-300'}`} placeholder="Additional notes..." />
                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : tire ? 'Update Tire' : 'Create Tire'}
                </button>
            </div>
        </form>
    );
};

export default TireForm;
