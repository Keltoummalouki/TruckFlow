import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    TrendingUp,
    Truck,
    Navigation,
    Wrench,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTrucks: 0,
        activeTrucks: 0,
        totalTrips: 0,
        activeTrips: 0,
        completedTrips: 0,
        pendingMaintenance: 0,
        scheduledMaintenance: 0,
        totalDrivers: 0,
        activeDrivers: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch data from available APIs
            const [trucksRes, tripsRes, maintenanceRes, trailersRes] = await Promise.all([
                axiosClient.get('/trucks?limit=100').catch(() => ({ data: { data: [] } })),
                axiosClient.get('/trips?limit=100').catch(() => ({ data: { data: [] } })),
                axiosClient.get('/maintenance?limit=100').catch(() => ({ data: { data: [] } })),
                axiosClient.get('/trailers?limit=100').catch(() => ({ data: { data: [] } }))
            ]);

            const trucksData = trucksRes.data.data || [];
            const tripsData = tripsRes.data.data || [];
            const maintenanceData = maintenanceRes.data.data || [];
            const trailersData = trailersRes.data.data || [];

            // Calculate stats
            setStats({
                totalTrucks: trucksData.length,
                activeTrucks: trucksData.filter(t => t.status === 'active').length,
                totalTrips: tripsData.length,
                activeTrips: tripsData.filter(t => t.status === 'in_progress').length,
                completedTrips: tripsData.filter(t => t.status === 'completed').length,
                pendingMaintenance: maintenanceData.filter(m => m.status === 'scheduled' || m.status === 'in_progress').length,
                scheduledMaintenance: maintenanceData.filter(m => m.status === 'scheduled').length,
                totalTrailers: trailersData.length,
                activeTrailers: trailersData.filter(t => t.status === 'available').length
            });

            // Build recent activities from trips and maintenance
            const activities = [];

            // Add recent trips
            tripsData.slice(0, 5).forEach(trip => {
                activities.push({
                    id: trip._id,
                    type: 'trip',
                    message: `Trip ${trip.startLocation} → ${trip.endLocation}`,
                    time: formatTimeAgo(trip.updatedAt || trip.createdAt),
                    status: trip.status === 'completed' ? 'success' : trip.status === 'in_progress' ? 'info' : 'warning',
                    date: new Date(trip.updatedAt || trip.createdAt)
                });
            });

            // Add recent maintenance
            maintenanceData.slice(0, 5).forEach(m => {
                activities.push({
                    id: m._id,
                    type: 'maintenance',
                    message: `${m.type.replace('_', ' ')} - ${m.targetType}`,
                    time: formatTimeAgo(m.updatedAt || m.createdAt),
                    status: m.status === 'completed' ? 'success' : m.status === 'scheduled' ? 'warning' : 'info',
                    date: new Date(m.updatedAt || m.createdAt)
                });
            });

            // Sort by date and take top 6
            activities.sort((a, b) => b.date - a.date);
            setRecentActivities(activities.slice(0, 6));

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    const statCards = [
        {
            label: 'Total Trucks',
            value: stats.totalTrucks,
            icon: Truck,
            color: 'blue',
            trend: `${stats.activeTrucks} active`
        },
        {
            label: 'Active Trips',
            value: stats.activeTrips,
            icon: Navigation,
            color: 'green',
            trend: `${stats.completedTrips} completed`
        },
        {
            label: 'Pending Maintenance',
            value: stats.pendingMaintenance,
            icon: Wrench,
            color: 'orange',
            trend: `${stats.scheduledMaintenance} scheduled`
        },
        {
            label: 'Total Trailers',
            value: stats.totalTrailers || 0,
            icon: Truck,
            color: 'purple',
            trend: `${stats.activeTrailers || 0} available`
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
            purple: 'from-purple-500 to-purple-600',
        };
        return colors[color] || colors.blue;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-orange-600" />;
            default:
                return <Clock className="h-5 w-5 text-blue-600" />;
        }
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
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-3xl p-8 shadow-2xl border border-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Here's what's happening with your fleet today.
                    </p>
                </div>
            </div>

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

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {recentActivities.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No recent activity
                        </div>
                    ) : (
                        recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="mt-0.5">
                                        {getStatusIcon(activity.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/trips" className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 text-left group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Navigation className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Create New Trip</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        Assign a new trip to a driver
                    </p>
                </Link>

                <Link to="/trucks" className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all duration-200 text-left group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Truck className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Add Truck</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        Register a new truck to the fleet
                    </p>
                </Link>

                <Link to="/maintenance" className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 text-left group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Wrench className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Schedule Maintenance</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        Plan upcoming maintenance tasks
                    </p>
                </Link>
            </div>
        </div>
    );
}
