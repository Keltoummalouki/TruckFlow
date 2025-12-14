import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import useAlert from '../../hooks/useAlert';
import Modal from '../../components/common/Modal';
import {
    Navigation,
    MapPin,
    Calendar,
    Truck,
    Clock,
    Play,
    CheckCircle,
    Download,
    Eye,
    Loader2,
    Fuel,
    Gauge,
    FileText,
    X
} from 'lucide-react';

export default function MyTrips() {
    const { user } = useAuth();
    const alert = useAlert();
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        startMileage: '',
        endMileage: '',
        fuelVolume: '',
        comments: ''
    });

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/trips?limit=100');
            const allTrips = response.data.data || [];
            // Filter trips for this driver
            const myTrips = allTrips.filter(trip =>
                trip.driver === user?.id || trip.driver?._id === user?.id
            );
            setTrips(myTrips);
        } catch (error) {
            alert.error('Failed to load trips');
        } finally {
            setLoading(false);
        }
    };

    const filteredTrips = trips.filter(trip => {
        if (filter === 'all') return true;
        return trip.status === filter;
    });

    const openTripModal = (trip) => {
        setSelectedTrip(trip);
        setFormData({
            startMileage: trip.startMileage || '',
            endMileage: trip.endMileage || '',
            fuelVolume: trip.fuelVolume || '',
            comments: trip.comments || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTrip(null);
    };

    const startTrip = async (trip) => {
        const confirmStart = await alert.confirm(
            'Start Trip?',
            'Are you ready to start this trip? You will need to enter your starting odometer reading.'
        );
        if (!confirmStart) return;

        const startMileage = window.prompt('Please enter current odometer reading (km):');
        if (!startMileage) return;

        try {
            await axiosClient.patch(`/trips/${trip._id}/start`, {
                startMileage: Number(startMileage)
            });
            alert.success('Trip started successfully!');
            loadTrips();
        } catch (error) {
            alert.error('Failed to start trip');
        }
    };

    const updateTrip = async () => {
        if (!selectedTrip) return;
        setUpdating(true);
        try {
            await axiosClient.patch(`/trips/${selectedTrip._id}/details`, formData);
            alert.success('Trip updated successfully!');
            closeModal();
            loadTrips();
        } catch (error) {
            alert.error('Failed to update trip');
        } finally {
            setUpdating(false);
        }
    };

    const completeTrip = async () => {
        if (!selectedTrip) return;

        if (!formData.endMileage || !formData.fuelVolume) {
            alert.error('Please enter end mileage and fuel consumed');
            return;
        }

        setUpdating(true);
        try {
            await axiosClient.patch(`/trips/${selectedTrip._id}/complete`, {
                endMileage: Number(formData.endMileage),
                fuelVolume: Number(formData.fuelVolume),
                completionNotes: formData.comments,
                actualArrival: new Date()
            });
            alert.success('Trip completed successfully!');
            closeModal();
            loadTrips();
        } catch (error) {
            alert.error('Failed to complete trip');
        } finally {
            setUpdating(false);
        }
    };

    const downloadPDF = async (trip) => {
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();

            // Brand Colors
            const primaryColor = [37, 99, 235]; // Blue-600
            const secondaryColor = [71, 85, 105]; // Slate-600
            const accentColor = [22, 163, 74]; // Green-600

            // 1. Header Section
            // Logo Background
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 40, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('TRUCKFLOW', 14, 25);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Mission Order Report', 14, 33);

            // Right Header Info
            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, 20, { align: 'right' });
            doc.text(`Ref: ${trip._id.slice(-8).toUpperCase()}`, 196, 28, { align: 'right' });

            // 2. Status Badge
            const statusText = trip.status.replace('_', ' ').toUpperCase();
            doc.setFillColor(240, 240, 240);
            doc.roundedRect(14, 50, 40, 10, 2, 2, 'F');
            doc.setTextColor(...primaryColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(statusText, 34, 56.5, { align: 'center' });

            // 3. Main Trip Information
            let y = 75;

            // Route Section
            doc.setTextColor(...secondaryColor);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('ROUTE INFORMATION', 14, y);

            doc.setDrawColor(200, 200, 200);
            doc.line(14, y + 2, 196, y + 2);
            y += 15;

            const routeData = [
                ['Departure', trip.departureLoc],
                ['Arrival', trip.arrivalLoc],
                ['Scheduled Date', new Date(trip.scheduledDeparture).toLocaleString()]
            ];

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);

            routeData.forEach(([label, value]) => {
                doc.setTextColor(100, 100, 100);
                doc.text(label, 14, y);
                doc.setTextColor(0, 0, 0);
                doc.text(value, 60, y);
                y += 10;
            });

            // Vehicle & Driver Section
            y += 10;
            doc.setTextColor(...secondaryColor);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('VEHICLE & DRIVER', 14, y);

            doc.setDrawColor(200, 200, 200);
            doc.line(14, y + 2, 196, y + 2);
            y += 15;

            const vehicleData = [
                ['Truck', trip.truck?.licensePlate || 'N/A'],
                ['Driver', `${user?.firstName} ${user?.lastName}`]
            ];

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);

            vehicleData.forEach(([label, value]) => {
                doc.setTextColor(100, 100, 100);
                doc.text(label, 14, y);
                doc.setTextColor(0, 0, 0);
                doc.text(value, 60, y);
                y += 10;
            });

            // Trip Statistics (if started/completed)
            if (trip.startMileage) {
                y += 10;
                doc.setTextColor(...secondaryColor);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.text('TRIP LOGS', 14, y);

                doc.setDrawColor(200, 200, 200);
                doc.line(14, y + 2, 196, y + 2);
                y += 15;

                const logs = [
                    ['Start Mileage', `${trip.startMileage} km`],
                    ['End Mileage', trip.endMileage ? `${trip.endMileage} km` : '---'],
                    ['Fuel Consumed', trip.fuelVolume ? `${trip.fuelVolume} L` : '---'],
                    ['Comments', trip.comments || 'No comments']
                ];

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);

                logs.forEach(([label, value]) => {
                    doc.setTextColor(100, 100, 100);
                    doc.text(label, 14, y);
                    doc.setTextColor(0, 0, 0);
                    doc.text(String(value), 60, y);
                    y += 10;
                });
            }

            // Footer
            const pageHeight = doc.internal.pageSize.height;
            doc.setFillColor(...primaryColor);
            doc.rect(0, pageHeight - 15, 210, 15, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.text('TruckFlow Fleet Management System', 14, pageHeight - 9);
            doc.text('www.truckflow.com', 196, pageHeight - 9, { align: 'right' });

            doc.save(`Trip_Report_${trip._id.slice(-8)}.pdf`);
            alert.success('Report downloaded successfully!');
        } catch (error) {
            console.error(error);
            alert.error('Failed to generate PDF');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        const icons = {
            pending: <Clock className="h-3 w-3 mr-1" />,
            in_progress: <Play className="h-3 w-3 mr-1" />,
            completed: <CheckCircle className="h-3 w-3 mr-1" />,
            cancelled: <X className="h-3 w-3 mr-1" />
        };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status.replace('_', ' ')}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
                    <p className="text-gray-600 mt-1">Manage your assigned trips and update status</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'in_progress', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {status === 'all' ? 'All Trips' : status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Trips List */}
            <div className="space-y-4">
                {filteredTrips.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                        <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-600">No trips found</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {filter === 'all' ? 'No trips assigned yet' : `No ${filter.replace('_', ' ')} trips`}
                        </p>
                    </div>
                ) : (
                    filteredTrips.map((trip) => (
                        <div key={trip._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Trip Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <MapPin className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {trip.departureLoc} → {trip.arrivalLoc}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(trip.scheduledDeparture).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Truck className="h-4 w-4" />
                                                    {trip.truck?.licensePlate || 'N/A'}
                                                </span>
                                                {trip.fuelVolume > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Fuel className="h-4 w-4" />
                                                        {trip.fuelVolume}L
                                                    </span>
                                                )}
                                                {trip.startMileage && (
                                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                                        Start: {trip.startMileage}km
                                                    </span>
                                                )}
                                                {trip.endMileage && (
                                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                                        End: {trip.endMileage}km
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-3 ml-auto">
                                        {getStatusBadge(trip.status)}

                                        <div className="flex gap-2">
                                            {trip.status === 'pending' && (
                                                <button
                                                    onClick={() => startTrip(trip)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                                                >
                                                    <Play className="h-4 w-4" />
                                                    Start
                                                </button>
                                            )}

                                            <button
                                                onClick={() => openTripModal(trip)}
                                                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() => downloadPDF(trip)}
                                                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Trip Details Modal */}
            <Modal isOpen={showModal} onClose={closeModal} title="Trip Details" size="lg">
                {selectedTrip && (
                    <div className="space-y-6">
                        {/* Trip Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Route Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Departure</p>
                                    <p className="font-medium">{selectedTrip.departureLoc}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Arrival</p>
                                    <p className="font-medium">{selectedTrip.arrivalLoc}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Scheduled</p>
                                    <p className="font-medium">{new Date(selectedTrip.scheduledDeparture).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Truck</p>
                                    <p className="font-medium">{selectedTrip.truck?.licensePlate || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Update Form */}
                        {selectedTrip.status !== 'completed' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Gauge className="h-5 w-5" />
                                    Trip Data
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Mileage (km)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.startMileage}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startMileage: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter odometer reading"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Mileage (km)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.endMileage}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endMileage: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter odometer reading"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fuel Consumed (L)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.fuelVolume}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fuelVolume: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter fuel consumed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Comments / Notes
                                    </label>
                                    <textarea
                                        value={formData.comments}
                                        onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Add any notes about the trip..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Completed Trip Summary */}
                        {selectedTrip.status === 'completed' && (
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="font-semibold text-green-800 mb-3">Trip Summary</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-green-600">Distance</p>
                                        <p className="font-bold text-green-800">
                                            {selectedTrip.endMileage - selectedTrip.startMileage} km
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-green-600">Fuel Used</p>
                                        <p className="font-bold text-green-800">{selectedTrip.fuelVolume} L</p>
                                    </div>
                                    <div>
                                        <p className="text-green-600">Efficiency</p>
                                        <p className="font-bold text-green-800">
                                            {selectedTrip.fuelVolume > 0
                                                ? ((selectedTrip.endMileage - selectedTrip.startMileage) / selectedTrip.fuelVolume * 100).toFixed(1)
                                                : 'N/A'} km/100L
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Close
                            </button>

                            {selectedTrip.status === 'in_progress' && (
                                <>
                                    <button
                                        onClick={updateTrip}
                                        disabled={updating}
                                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updating && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={completeTrip}
                                        disabled={updating}
                                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Complete Trip
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => downloadPDF(selectedTrip)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
