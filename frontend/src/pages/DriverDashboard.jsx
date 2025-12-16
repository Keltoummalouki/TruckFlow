import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    Navigation,
    Truck,
    Clock,
    CheckCircle,
    AlertCircle,
    MapPin,
    Calendar,
    TrendingUp,
    Play,
    Eye,
    Loader2
} from 'lucide-react';

export default function DriverDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTrips: 0,
        inProgress: 0,
        completed: 0,
        pending: 0
    });
    const [todayTrips, setTodayTrips] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/trips?limit=100');
            const allTrips = response.data.data || [];

            // Filter trips for this driver only
            const myTrips = allTrips.filter(trip =>
                trip.driver === user?.id || trip.driver?._id === user?.id
            );

            // Calculate stats
            setStats({
                totalTrips: myTrips.length,
                inProgress: myTrips.filter(t => t.status === 'in_progress').length,
                completed: myTrips.filter(t => t.status === 'completed').length,
                pending: myTrips.filter(t => t.status === 'pending').length
            });

            // Get today's trips (pending and in_progress)
            const activeTrips = myTrips
                .filter(t => t.status === 'pending' || t.status === 'in_progress')
                .slice(0, 5);
            setTodayTrips(activeTrips);

        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            in_progress: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const statCards = [
        { label: 'Total Trips', value: stats.totalTrips, icon: Navigation, color: 'blue', trend: 'This month' },
        { label: 'In Progress', value: stats.inProgress, icon: Play, color: 'orange', trend: 'Active now' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green', trend: 'Well done!' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'yellow', trend: 'Awaiting start' },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
            yellow: 'from-yellow-500 to-yellow-600',
        };
        return colors[color] || colors.blue;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-slate-900 rounded-3xl p-8 shadow-2xl border border-green-500/20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Welcome back, {user?.firstName}! 🚛
                    </h1>
                    <p className="text-green-100 text-lg">
                        Here's your trip overview for today. Drive safe!
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(stat.color)} shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-medium text-slate-600 mb-2">
                                {stat.label}
                            </p>
                            <p className="text-xs text-slate-500">
                                {stat.trend}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Today's Trips */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Your Active Trips</h2>
                    <Link to="/my-trips" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All →
                    </Link>
                </div>

                <div className="divide-y divide-gray-200">
                    {todayTrips.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No active trips</p>
                            <p className="text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        todayTrips.map((trip) => (
                            <div key={trip._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <MapPin className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {trip.departureLoc} → {trip.arrivalLoc}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(trip.scheduledDeparture).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Truck className="h-4 w-4" />
                                                    {trip.truck?.licensePlate || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(trip.status)}
                                        <Link
                                            to="/my-trips"
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Eye className="h-5 w-5 text-gray-600" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/my-trips" className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Navigation className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">View My Trips</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        See all assigned trips and update status
                    </p>
                </Link>

                <Link to="/profile" className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all duration-200 group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                            <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">My Profile</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        View and update your profile information
                    </p>
                </Link>
            </div>
        </div>
    );
}