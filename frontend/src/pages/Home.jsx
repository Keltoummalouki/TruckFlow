import { Link } from 'react-router-dom';
import {
    Activity,
    Truck,
    Shield,
    Clock,
    MapPin,
    Fuel,
    Wrench,
    Users,
    ArrowRight,
    CheckCircle2,
    BarChart3,
    Route,
    Bell,
    FileText
} from 'lucide-react';

export default function Home() {
    const features = [
        {
            icon: <Truck className="w-6 h-6" />,
            title: 'Fleet Management',
            description: 'Track and manage your entire fleet of trucks and trailers in real-time with detailed vehicle information.'
        },
        {
            icon: <Route className="w-6 h-6" />,
            title: 'Trip Planning',
            description: 'Create, assign, and monitor trips with complete visibility over routes, drivers, and cargo.'
        },
        {
            icon: <Fuel className="w-6 h-6" />,
            title: 'Fuel Tracking',
            description: 'Monitor fuel consumption across your fleet to optimize costs and identify inefficiencies.'
        },
        {
            icon: <Wrench className="w-6 h-6" />,
            title: 'Maintenance Scheduling',
            description: 'Proactive maintenance alerts for tires, oil changes, and regular servicing to prevent breakdowns.'
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: 'Analytics & Reports',
            description: 'Comprehensive reports on mileage, fuel usage, maintenance costs, and driver performance.'
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: 'Mission Orders',
            description: 'Generate and download professional PDF mission orders for each trip assignment.'
        }
    ];

    const stats = [
        { value: '50+', label: 'Vehicles Managed' },
        { value: '1000+', label: 'Trips Completed' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
    ];

    const benefits = [
        'Real-time GPS tracking for all vehicles',
        'Automated maintenance reminders',
        'Fuel consumption analytics',
        'Driver performance monitoring',
        'Paperless trip documentation',
        'Role-based access control'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                Truck<span className="text-blue-600">Flow</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Features
                            </a>
                            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                About
                            </a>
                            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Contact
                            </a>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/50 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-700">Fleet Management Solution</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            Streamline Your
                            <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                                Fleet Operations
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                            The complete fleet management platform for trucking companies. Track vehicles, manage trips,
                            monitor fuel consumption, and schedule maintenance — all in one powerful dashboard.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link
                                to="/register"
                                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Users className="mr-2 w-5 h-5" />
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Everything You Need to Manage Your Fleet
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Powerful features designed specifically for trucking companies to optimize operations and reduce costs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/50 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About/Benefits Section */}
            <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Why Choose TruckFlow?
                            </h2>
                            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                                Say goodbye to spreadsheets, phone calls, and paper documents. TruckFlow centralizes
                                all your fleet data in one intuitive platform, giving you complete visibility and control
                                over your operations.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        </div>
                                        <span className="text-slate-200">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
                                <div className="space-y-6">
                                    {/* Mock Dashboard Preview */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Active Vehicles</p>
                                                <p className="text-slate-400 text-sm">Real-time tracking</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-white">24</span>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                <Route className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Trips Today</p>
                                                <p className="text-slate-400 text-sm">On schedule</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-white">12</span>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                                <Bell className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Maintenance Alerts</p>
                                                <p className="text-slate-400 text-sm">Upcoming services</p>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-white">3</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl rotate-12">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl -rotate-12">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                        Ready to Transform Your Fleet Management?
                    </h2>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                        Join trucking companies that have already upgraded their operations with TruckFlow.
                        Start your free trial today — no credit card required.
                    </p>
                    <Link
                        to="/register"
                        className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                    >
                        Get Started for Free
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-blue-600 p-2 rounded-xl">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">
                                    Truck<span className="text-blue-400">Flow</span>
                                </span>
                            </div>
                            <p className="text-slate-400 max-w-md leading-relaxed">
                                The complete fleet management solution for modern trucking companies.
                                Streamline operations, reduce costs, and gain full visibility over your fleet.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                                Product
                            </h3>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
                                <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Register</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                                Contact
                            </h3>
                            <ul className="space-y-3 text-slate-400">
                                <li>Email: contact@truckflow.com</li>
                                <li>Phone: +1 (555) 123-4567</li>
                                <li>Address: 123 Fleet Street</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © 2025 TruckFlow. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
