import { useAuth } from '../context/AuthContext';
import {
    Navigation,
    MapPin,
    Clock,
    Package,
    CheckCircle,
    AlertCircle,
    Truck
} from 'lucide-react';

export default function DriverDashboard() {
    const { user } = useAuth();

    const myTrips = [
        {
            id: 'TR-1245',
            from: 'Paris',
            to: 'Lyon',
            status: 'in-progress',
            departure: '2025-12-12 08:00',
            eta: '2025-12-12 14:00',
            cargo: 'Electronics',
            truck: 'TRK-008'
        },
        {
            id: 'TR-1246',
            from: 'Lyon',
            to: 'Marseille',
            status: 'pending',
            departure: '2025-12-13 09:00',
            eta: '2025-12-13 12:30',
            cargo: 'Furniture',
            truck: 'TRK-008'
        },
        {
            id: 'TR-1244',
            from: 'Bordeaux',
            to: 'Paris',
            status: 'completed',
            departure: '2025-12-11 07:00',
            eta: '2025-12-11 13:00',
            cargo: 'Food Products',
            truck: 'TRK-008'
        },
    ];

    const stats = [
        { label: 'Active Trips', value: '1', icon: Navigation, color: 'blue' },
        { label: 'Completed This Week', value: '8', icon: CheckCircle, color: 'green' },
        { label: 'Total Distance', value: '2,450 km', icon: MapPin, color: 'purple' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'in-progress':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                        In Progress
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                    </span>
                );
            default:
                return null;
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-3xl p-8 shadow-2xl border border-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Hello, {user?.firstName}! 🚛
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Your trips and schedule overview.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(stat.color)} shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-medium text-slate-600">
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-slate-900">My Trips</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {myTrips.map((trip) => (
                        <div
                            key={trip.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {trip.id}
                                        </h3>
                                        {getStatusBadge(trip.status)}
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-600">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm font-medium">{trip.from}</span>
                                        <span className="text-slate-400">→</span>
                                        <span className="text-sm font-medium">{trip.to}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 text-xs mb-1">Departure</p>
                                    <p className="font-medium text-slate-900">
                                        {new Date(trip.departure).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs mb-1">ETA</p>
                                    <p className="font-medium text-slate-900">
                                        {new Date(trip.eta).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs mb-1">Cargo</p>
                                    <div className="flex items-center space-x-1">
                                        <Package className="h-3 w-3 text-slate-400" />
                                        <p className="font-medium text-slate-900">{trip.cargo}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs mb-1">Truck</p>
                                    <div className="flex items-center space-x-1">
                                        <Truck className="h-3 w-3 text-slate-400" />
                                        <p className="font-medium text-slate-900">{trip.truck}</p>
                                    </div>
                                </div>
                            </div>

                            {trip.status === 'in-progress' && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                                        Update Trip Status
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                            Upcoming Maintenance
                        </h3>
                        <p className="text-sm text-slate-700">
                            Your assigned truck (TRK-008) is scheduled for maintenance on Dec 15, 2025.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
