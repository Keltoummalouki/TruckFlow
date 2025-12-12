import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Activity,
    LayoutDashboard,
    Truck,
    Container,
    CircleDot,
    Wrench,
    FileText,
    Navigation,
    User,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, onToggle }) {
    const location = useLocation();
    const { user } = useAuth();

    const adminMenuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/trips', icon: Navigation, label: 'Trips' },
        { path: '/trucks', icon: Truck, label: 'Trucks' },
        { path: '/trailers', icon: Container, label: 'Trailers' },
        { path: '/tires', icon: CircleDot, label: 'Tires' },
        { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
        { path: '/reports', icon: FileText, label: 'Reports' },
    ];

    const driverMenuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/my-trips', icon: Navigation, label: 'My Trips' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    const menuItems = user?.role === 'admin' ? adminMenuItems : driverMenuItems;

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900
          transition-all duration-300 z-50 flex flex-col
          ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
          lg:relative lg:z-auto
        `}
            >
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30 shadow-lg">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">
                                    Truck<span className="text-blue-200">Flow</span>
                                </span>
                            </div>

                            <div className={`hidden lg:flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-0 w-0' : 'opacity-100 w-full'}`}>
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30 shadow-lg">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => window.innerWidth < 1024 && onToggle()}
                                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group relative overflow-hidden
                    ${active
                                            ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg text-white'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white border border-transparent'
                                        }
                  `}
                                >
                                    {active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                    )}

                                    <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : ''}`} />

                                    <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden lg:block p-4 border-t border-white/10">
                        <button
                            onClick={onToggle}
                            className="w-full flex items-center justify-center p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
                        >
                            {isOpen ? (
                                <ChevronLeft className="h-5 w-5" />
                            ) : (
                                <ChevronRight className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className={`p-4 border-t border-white/10 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                        <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-blue-200 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
