import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, AlertCircle, Loader2, Truck, Shield, Clock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password });
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30 shadow-lg">
                            <Activity className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            Truck<span className="text-blue-200">Flow</span>
                        </span>
                    </div>

                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-5xl font-bold leading-tight">
                            Streamline Your Fleet Operations
                        </h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            Manage your entire trucking business from one powerful platform. Track shipments, monitor drivers, and optimize routes in real-time.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                { icon: <Truck size={20} />, text: 'Real-time Fleet Tracking' },
                                { icon: <Shield size={20} />, text: 'Enterprise-grade Security' },
                                { icon: <Clock size={20} />, text: 'Save Hours Every Week' }
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center space-x-3 text-blue-50">
                                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                                        {feature.icon}
                                    </div>
                                    <span className="text-lg">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-blue-200 text-sm">
                        © 2025 TruckFlow. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="max-w-md w-full">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden flex-col items-center mb-8">
                        <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-600/30">
                            <Activity className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Truck<span className="text-blue-600">Flow</span>
                        </h1>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                            <p className="text-slate-600 text-sm">Sign in to continue to your dashboard</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <div className="bg-red-100 p-1.5 rounded-lg flex-shrink-0">
                                    <AlertCircle size={16} className="text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-900">Authentication Failed</p>
                                    <p className="text-sm text-red-700 mt-0.5">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-slate-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all pr-12 text-slate-900 placeholder:text-slate-400"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1.5 hover:bg-gray-100 rounded-md"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-sm text-slate-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
