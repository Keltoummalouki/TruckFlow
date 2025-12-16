import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useMaintenances } from '../../context/MaintenanceContext';
import useAlert from '../../hooks/useAlert';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import MaintenanceForm from './MaintenanceForm';
import { format } from 'date-fns';

const MaintenanceList = () => {
    const { maintenances, loading, pagination, fetchMaintenances, deleteMaintenance } = useMaintenances();
    const alert = useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadMaintenances = async () => {
        try {
            const params = { page: currentPage, limit: itemsPerPage };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;
            if (typeFilter) params.type = typeFilter;
            await fetchMaintenances(params);
        } catch (error) {
            alert.error(error.message || 'Failed to load maintenance records');
        }
    };

    useEffect(() => {
        loadMaintenances();
    }, [currentPage, itemsPerPage, searchTerm, statusFilter, typeFilter]);

    const handleDelete = async (maintenance) => {
        const result = await alert.confirm(
            'Delete Maintenance Record',
            `Are you sure you want to delete this ${maintenance.type} maintenance record?`
        );
        if (result.isConfirmed) {
            try {
                await deleteMaintenance(maintenance._id);
                alert.success('Maintenance record deleted successfully');
            } catch (error) {
                alert.error(error.message || 'Failed to delete maintenance record');
            }
        }
    };

    const columns = [
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (m) => <span className="capitalize font-semibold">{m.type}</span>
        },
        {
            key: 'targetType',
            label: 'Target',
            render: (m) => (
                <div>
                    <span className="capitalize text-sm text-gray-600">{m.targetType}</span>
                    {m.truck && <div className="text-xs text-gray-500">{m.truck.licensePlate || 'N/A'}</div>}
                </div>
            )
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (m) => format(new Date(m.date), 'MMM dd, yyyy')
        },
        {
            key: 'cost',
            label: 'Cost',
            sortable: true,
            render: (m) => `$${m.cost?.toLocaleString() || '0'}`
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (m) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.status === 'completed' ? 'bg-green-100 text-green-800' :
                        m.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            m.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                    }`}>
                    {m.status.replace('_', ' ')}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
                    <p className="text-gray-600 mt-1">Track maintenance records and schedules</p>
                </div>
                <button
                    onClick={() => { setSelectedMaintenance(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Maintenance
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search maintenance..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        <option value="oil_change">Oil Change</option>
                        <option value="tire_rotation">Tire Rotation</option>
                        <option value="brake_service">Brake Service</option>
                        <option value="inspection">Inspection</option>
                        <option value="repair">Repair</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="h-5 w-5" />
                        Export
                    </button>
                </div>
            </div>

            <div>
                <Table
                    columns={columns}
                    data={maintenances}
                    onEdit={(m) => { setSelectedMaintenance(m); setIsModalOpen(true); }}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No maintenance records found. Add your first record to get started!"
                />
                {!loading && maintenances.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(limit) => { setItemsPerPage(limit); setCurrentPage(1); }}
                    />
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedMaintenance(null); }}
                title={selectedMaintenance ? 'Edit Maintenance' : 'Add Maintenance Record'}
                size="lg"
            >
                <MaintenanceForm
                    maintenance={selectedMaintenance}
                    onSuccess={() => { setIsModalOpen(false); setSelectedMaintenance(null); loadMaintenances(); }}
                    onCancel={() => { setIsModalOpen(false); setSelectedMaintenance(null); }}
                />
            </Modal>
        </div>
    );
};

export default MaintenanceList;
