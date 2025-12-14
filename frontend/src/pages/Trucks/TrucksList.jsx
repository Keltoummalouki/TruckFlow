import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useTrucks } from '../../context/TruckContext';
import useAlert from '../../hooks/useAlert';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import TruckForm from './TruckForm';

const TrucksList = () => {
    const { trucks, loading, pagination, fetchTrucks, deleteTruck } = useTrucks();
    const alert = useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch trucks on mount and when filters change
    useEffect(() => {
        loadTrucks();
    }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

    const loadTrucks = async () => {
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            await fetchTrucks(params);
        } catch (error) {
            alert.error(error.message || 'Failed to load trucks');
        }
    };

    const handleAddNew = () => {
        setSelectedTruck(null);
        setIsModalOpen(true);
    };

    const handleEdit = (truck) => {
        setSelectedTruck(truck);
        setIsModalOpen(true);
    };

    const handleDelete = async (truck) => {
        const result = await alert.confirm(
            'Delete Truck',
            `Are you sure you want to delete truck ${truck.licensePlate}? This action cannot be undone.`,
            'Yes, delete it!'
        );

        if (result.isConfirmed) {
            try {
                await deleteTruck(truck._id);
                alert.success('Truck deleted successfully');
            } catch (error) {
                alert.error(error.message || 'Failed to delete truck');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setSelectedTruck(null);
        loadTrucks();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (limit) => {
        setItemsPerPage(limit);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to first page
    };

    // Table columns configuration
    const columns = [
        {
            key: 'licensePlate',
            label: 'License Plate',
            sortable: true,
            render: (truck) => (
                <span className="font-semibold text-blue-600">{truck.licensePlate}</span>
            )
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
            key: 'year',
            label: 'Year',
            sortable: true
        },
        {
            key: 'capacity',
            label: 'Capacity (kg)',
            sortable: true,
            render: (truck) => truck.capacity?.toLocaleString() || 'N/A'
        },
        {
            key: 'mileage',
            label: 'Mileage (km)',
            sortable: true,
            render: (truck) => truck.mileage?.toLocaleString() || '0'
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (truck) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${truck.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : truck.status === 'maintenance'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {truck.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Trucks</h1>
                    <p className="text-gray-600 mt-1">Manage your fleet vehicles</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Truck
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by license plate, brand, or model..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Export Button */}
                    <div className="flex justify-end">
                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Download className="h-5 w-5" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div>
                <Table
                    columns={columns}
                    data={trucks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No trucks found. Add your first truck to get started!"
                />

                {/* Pagination */}
                {!loading && trucks.length > 0 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTruck(null);
                }}
                title={selectedTruck ? 'Edit Truck' : 'Add New Truck'}
                size="lg"
            >
                <TruckForm
                    truck={selectedTruck}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedTruck(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default TrucksList;
