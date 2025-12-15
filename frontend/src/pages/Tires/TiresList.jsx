import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useTires } from '../../context/TireContext';
import useAlert from '../../hooks/useAlert';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import TireForm from './TireForm';

const TiresList = () => {
    const { tires, loading, pagination, fetchTires, deleteTire } = useTires();
    const alert = useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTire, setSelectedTire] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadTires = async () => {
        try {
            const params = { page: currentPage, limit: itemsPerPage };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;
            await fetchTires(params);
        } catch (error) {
            alert.error(error.message || 'Failed to load tires');
        }
    };

    useEffect(() => {
        loadTires();
    }, [currentPage, itemsPerPage, searchTerm, statusFilter, loadTires]);

    const handleDelete = async (tire) => {
        const result = await alert.confirm(
            'Delete Tire',
            `Are you sure you want to delete tire ${tire.serialNumber}?`
        );
        if (result.isConfirmed) {
            try {
                await deleteTire(tire._id);
                alert.success('Tire deleted successfully');
            } catch (error) {
                alert.error(error.message || 'Failed to delete tire');
            }
        }
    };

    const columns = [
        {
            key: 'serialNumber',
            label: 'Serial Number',
            sortable: true,
            render: (tire) => <span className="font-semibold text-blue-600">{tire.serialNumber}</span>
        },
        {
            key: 'brand',
            label: 'Brand',
            sortable: true
        },
        {
            key: 'model',
            label: 'Model',
            sortable: true
        },
        {
            key: 'size',
            label: 'Size',
            sortable: true
        },
        {
            key: 'position',
            label: 'Position',
            render: (tire) => <span className="capitalize">{tire.position?.replace('_', ' ')}</span>
        },
        {
            key: 'currentMileage',
            label: 'Mileage (km)',
            render: (tire) => tire.currentMileage?.toLocaleString() || '0'
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (tire) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tire.status === 'new' ? 'bg-green-100 text-green-800' :
                        tire.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                            tire.status === 'worn' ? 'bg-yellow-100 text-yellow-800' :
                                tire.status === 'damaged' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                    }`}>
                    {tire.status.replace('_', ' ')}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tires</h1>
                    <p className="text-gray-600 mt-1">Manage tire inventory and tracking</p>
                </div>
                <button
                    onClick={() => { setSelectedTire(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Tire
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by serial number..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="in_use">In Use</option>
                        <option value="worn">Worn</option>
                        <option value="damaged">Damaged</option>
                        <option value="retired">Retired</option>
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
                    data={tires}
                    onEdit={(tire) => { setSelectedTire(tire); setIsModalOpen(true); }}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No tires found. Add your first tire to get started!"
                />
                {!loading && tires.length > 0 && (
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
                onClose={() => { setIsModalOpen(false); setSelectedTire(null); }}
                title={selectedTire ? 'Edit Tire' : 'Add New Tire'}
                size="lg"
            >
                <TireForm
                    tire={selectedTire}
                    onSuccess={() => { setIsModalOpen(false); setSelectedTire(null); loadTires(); }}
                    onCancel={() => { setIsModalOpen(false); setSelectedTire(null); }}
                />
            </Modal>
        </div>
    );
};

export default TiresList;
