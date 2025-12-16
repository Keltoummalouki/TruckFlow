import { useState, useEffect } from 'react';
import { Plus, Search, Download, Calendar } from 'lucide-react';
import { useTrips } from '../../context/TripContext';
import useAlert from '../../hooks/useAlert';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import TripForm from './TripForm';
import { format } from 'date-fns';

const TripsList = () => {
    const { trips, loading, pagination, fetchTrips, deleteTrip } = useTrips();
    const alert = useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadTrips = async () => {
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            await fetchTrips(params);
        } catch (error) {
            alert.error(error.message || 'Failed to load trips');
        }
    };

    // Fetch trips on mount and when filters change
    useEffect(() => {
        loadTrips();
    }, [currentPage, itemsPerPage, searchTerm, statusFilter, loadTrips]);

    const handleAddNew = () => {
        setSelectedTrip(null);
        setIsModalOpen(true);
    };

    const handleEdit = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    const handleDelete = async (trip) => {
        const result = await alert.confirm(
            'Delete Trip',
            `Are you sure you want to delete this trip from ${trip.departureLoc} to ${trip.arrivalLoc}?`,
            'Yes, delete it!'
        );

        if (result.isConfirmed) {
            try {
                await deleteTrip(trip._id);
                alert.success('Trip deleted successfully');
            } catch (error) {
                alert.error(error.message || 'Failed to delete trip');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setSelectedTrip(null);
        loadTrips();
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
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    // Format date helper
    const formatDate = (date) => {
        try {
            return format(new Date(date), 'MMM dd, yyyy HH:mm');
        } catch {
            return 'N/A';
        }
    };

    // Table columns configuration
    const columns = [
        {
            key: 'departureLoc',
            label: 'Route',
            sortable: true,
            render: (trip) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-blue-600">{trip.departureLoc}</span>
                    <span className="text-xs text-gray-500">→ {trip.arrivalLoc}</span>
                </div>
            )
        },
        {
            key: 'truck',
            label: 'Truck',
            render: (trip) => trip.truck?.licensePlate || 'N/A'
        },
        {
            key: 'driver',
            label: 'Driver',
            render: (trip) => trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : 'N/A'
        },
        {
            key: 'scheduledDeparture',
            label: 'Scheduled',
            sortable: true,
            render: (trip) => (
                <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(trip.scheduledDeparture)}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (trip) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : trip.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : trip.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                    }`}>
                    {trip.status.replace('_', ' ')}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
                    <p className="text-gray-600 mt-1">Manage transportation routes and schedules</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Trip
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
                            placeholder="Search by location..."
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
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
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
                    data={trips}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No trips found. Create your first trip to get started!"
                />

                {/* Pagination */}
                {!loading && trips.length > 0 && (
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
                    setSelectedTrip(null);
                }}
                title={selectedTrip ? 'Edit Trip' : 'Add New Trip'}
                size="xl"
            >
                <TripForm
                    trip={selectedTrip}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedTrip(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default TripsList;