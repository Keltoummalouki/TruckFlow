import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useTrailers } from '../../context/TrailerContext';
import useAlert from '../../hooks/useAlert';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import TrailerForm from './TrailerForm';

const TrailersList = () => {
    const { trailers, loading, pagination, fetchTrailers, deleteTrailer } = useTrailers();
    const alert = useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadTrailers = async () => {
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;
            if (typeFilter) params.type = typeFilter;

            await fetchTrailers(params);
        } catch (error) {
            alert.error(error.message || 'Failed to load trailers');
        }
    };

    useEffect(() => {
        loadTrailers();
    }, [currentPage, itemsPerPage, searchTerm, statusFilter, typeFilter, loadTrailers]);

    const handleAddNew = () => {
        setSelectedTrailer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (trailer) => {
        setSelectedTrailer(trailer);
        setIsModalOpen(true);
    };

    const handleDelete = async (trailer) => {
        const result = await alert.confirm(
            'Delete Trailer',
            `Are you sure you want to delete trailer ${trailer.licensePlate}?`,
            'Yes, delete it!'
        );

        if (result.isConfirmed) {
            try {
                await deleteTrailer(trailer._id);
                alert.success('Trailer deleted successfully');
            } catch (error) {
                alert.error(error.message || 'Failed to delete trailer');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setSelectedTrailer(null);
        loadTrailers();
    };

    const columns = [
        {
            key: 'licensePlate',
            label: 'License Plate',
            sortable: true,
            render: (trailer) => (
                <span className="font-semibold text-blue-600">{trailer.licensePlate}</span>
            )
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (trailer) => (
                <span className="capitalize">{trailer.type}</span>
            )
        },
        {
            key: 'capacity',
            label: 'Capacity (kg)',
            sortable: true,
            render: (trailer) => trailer.capacity?.toLocaleString() || 'N/A'
        },
        {
            key: 'mileage',
            label: 'Mileage (km)',
            sortable: true,
            render: (trailer) => trailer.mileage?.toLocaleString() || '0'
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (trailer) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trailer.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : trailer.status === 'in_use'
                            ? 'bg-blue-100 text-blue-800'
                            : trailer.status === 'maintenance'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                    }`}>
                    {trailer.status.replace('_', ' ')}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Trailers</h1>
                    <p className="text-gray-600 mt-1">Manage your fleet trailers</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Trailer
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by license plate..."
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
                        <option value="flatbed">Flatbed</option>
                        <option value="refrigerated">Refrigerated</option>
                        <option value="tanker">Tanker</option>
                        <option value="container">Container</option>
                        <option value="box">Box</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
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
                    data={trailers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No trailers found. Add your first trailer to get started!"
                />

                {!loading && trailers.length > 0 && (
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
                onClose={() => { setIsModalOpen(false); setSelectedTrailer(null); }}
                title={selectedTrailer ? 'Edit Trailer' : 'Add New Trailer'}
                size="lg"
            >
                <TrailerForm
                    trailer={selectedTrailer}
                    onSuccess={handleFormSuccess}
                    onCancel={() => { setIsModalOpen(false); setSelectedTrailer(null); }}
                />
            </Modal>
        </div>
    );
};

export default TrailersList;
