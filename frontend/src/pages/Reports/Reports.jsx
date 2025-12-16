import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Calendar, DollarSign, Truck } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { exportReportsToPDF } from '../../utils/exportUtils';

const Reports = () => {
    const [fuelData, setFuelData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [tripsData, setTripsData] = useState([]);
    const [fleetData, setFleetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rawData, setRawData] = useState({ trips: [], maintenance: [], trucks: [] });

    useEffect(() => {
        loadReportsData();
    }, []);

    const loadReportsData = async () => {
        setLoading(true);
        try {
            // Fetch data for reports
            const [trips, maintenance, trucks] = await Promise.all([
                axiosClient.get('/trips?limit=100'),
                axiosClient.get('/maintenance?limit=100'),
                axiosClient.get('/trucks?limit=100')
            ]);

            // Store raw data for export
            setRawData({
                trips: trips.data.data || [],
                maintenance: maintenance.data.data || [],
                trucks: trucks.data.data || []
            });

            // Process fuel consumption data
            processFuelData(trips.data.data);

            // Process maintenance data
            processMaintenanceData(maintenance.data.data);

            // Process trips data
            processTripsData(trips.data.data);

            // Process fleet data
            processFleetData(trucks.data.data);
        } catch (error) {
            console.error('Failed to load reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportAllData = () => {
        exportReportsToPDF(rawData);
    };

    const processFuelData = (trips) => {
        // Group trips by month and calculate fuel consumption
        const monthlyFuel = {};
        trips.forEach(trip => {
            if (trip.fuelVolume && trip.scheduledDeparture) {
                const month = new Date(trip.scheduledDeparture).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                if (!monthlyFuel[month]) {
                    monthlyFuel[month] = 0;
                }
                monthlyFuel[month] += trip.fuelVolume;
            }
        });

        const fuelChartData = Object.entries(monthlyFuel).map(([month, fuel]) => ({
            month,
            fuel: Math.round(fuel)
        })).slice(-6); // Last 6 months

        setFuelData(fuelChartData);
    };

    const processMaintenanceData = (maintenance) => {
        // Group by type
        const typeCounts = {};

        maintenance.forEach(m => {
            typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
        });

        const maintenanceChartData = Object.entries(typeCounts).map(([type, count]) => ({
            name: type.replace('_', ' '),
            value: count
        }));

        setMaintenanceData(maintenanceChartData);
    };

    const processTripsData = (trips) => {
        // Group by status
        const statusCounts = {
            pending: 0,
            in_progress: 0,
            completed: 0,
            cancelled: 0
        };

        trips.forEach(trip => {
            if (Object.prototype.hasOwnProperty.call(statusCounts, trip.status)) {
                statusCounts[trip.status]++;
            }
        });

        const tripsChartData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status.replace('_', ' '),
            value: count
        }));

        setTripsData(tripsChartData);
    };

    const processFleetData = (trucks) => {
        // Group by status
        const statusCounts = {
            active: 0,
            maintenance: 0,
            inactive: 0
        };

        trucks.forEach(truck => {
            if (Object.prototype.hasOwnProperty.call(statusCounts, truck.status)) {
                statusCounts[truck.status]++;
            }
        });

        const fleetChartData = Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count
        }));

        setFleetData(fleetChartData);
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">Visual insights into your fleet operations</p>
                </div>
                <button
                    onClick={exportAllData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download className="h-5 w-5" />
                    Export PDF
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Trips</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {tripsData.reduce((sum, item) => sum + item.value, 0)}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Fuel Consumed</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {fuelData.reduce((sum, item) => sum + item.fuel, 0)}L
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Maintenance</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {maintenanceData.reduce((sum, item) => sum + item.value, 0)}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {tripsData.find(t => t.name === 'completed')?.value || 0}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fuel Consumption Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Consumption (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fuelData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="fuel" fill="#3b82f6" name="Fuel (Liters)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Trips Status Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trips by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={tripsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {tripsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Maintenance by Type */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance by Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={maintenanceData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {maintenanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Fleet Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fleetData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8b5cf6" name="Trucks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
