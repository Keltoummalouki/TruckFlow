import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, Settings, LogOut, Bell } from 'lucide-react';

export default function Header({ onMenuToggle, pageTitle }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                {/* Left Section - Mobile Menu & Page Title */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                            {pageTitle || 'Dashboard'}
                        </h1>
                    </div>
                </div>

                {/* Right Section - Notifications & User Menu */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 pr-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
                        >
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-600/30">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-slate-500 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {user?.email}
                                    </p>
                                    <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg capitalize">
                                        {user?.role}
                                    </span>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>My Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/settings');
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
