import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Shield, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch {
      // Error handled in context
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              Join the Future of Fleet Management
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create your account today and start optimizing your logistics operations with AI-driven insights.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: <CheckCircle size={20} />, text: '30-day free trial' },
                { icon: <Shield size={20} />, text: 'No credit card required' },
                { icon: <Clock size={20} />, text: 'Get started in minutes' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-blue-50">
                  <div className="bg-green-500/20 backdrop-blur-sm p-2 rounded-lg border border-green-400/30">
                    <span className="text-green-400">{feature.icon}</span>
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            © 2025 TruckFlow. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-md w-full">
          <div className="flex lg:hidden flex-col items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-600/30">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Truck<span className="text-blue-600">Flow</span>
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-600 text-sm">Get started with TruckFlow in seconds</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <div className="bg-red-100 p-1.5 rounded-lg flex-shrink-0">
                  <AlertCircle size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Registration Failed</p>
                  <p className="text-sm text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all pr-12 text-slate-900 placeholder:text-slate-400"
                    placeholder="Create a strong password"
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

              <div className="flex items-start pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="ml-2.5 block text-sm text-slate-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
