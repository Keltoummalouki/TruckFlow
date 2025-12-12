import { useAuth } from '../context/AuthContext';
import {
    TrendingUp,
    Truck,
    Navigation,
    Wrench,
    Users,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();

    const stats = [
        {
            label: 'Total Trucks',
            value: '24',
            icon: Truck,
            color: 'blue',
            trend: '+2 this month'
        },
        {
            label: 'Active Trips',
            value: '18',
            icon: Navigation,
            color: 'green',
            trend: '12 in progress'
        },
        {
            label: 'Pending Maintenance',
            value: '5',
            icon: Wrench,
            color: 'orange',
            trend: '2 urgent'
        },
        {
            label: 'Total Drivers',
            value: '32',
            icon: Users,
            color: 'purple',
            trend: '28 active'
        },
    ];

    const recentActivities = [
        { id: 1, type: 'trip', message: 'Trip #TR-1234 completed', time: '2 hours ago', status: 'success' },
        { id: 2, type: 'maintenance', message: 'Truck TRK-005 maintenance scheduled', time: '4 hours ago', status: 'warning' },
        { id: 3, type: 'driver', message: 'New driver John Doe registered', time: '6 hours ago', status: 'info' },
        { id: 4, type: 'trip', message: 'Trip #TR-1235 started', time: '8 hours ago', status: 'success' },
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

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
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

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {recentActivities.map((activity) => (
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
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 text-left group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Navigation className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Create New Trip</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        Assign a new trip to a driver
                    </p>
                </button>

                <button className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all duration-200 text-left group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Truck className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Add Truck</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        Register a new truck to the fleet
                    </p>
                </button>

                <button className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 text-left group hover:shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Wrench className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Schedule Maintenance</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                        Plan upcoming maintenance tasks
                    </p>
                </button>
            </div>
        </div>
    );
}
