import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Shield, Save, Loader2, Edit2, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import useAlert from '../hooks/useAlert';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const alert = useAlert();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                licenseNumber: user.licenseNumber || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.put('/auth/profile', formData);
            if (updateUser) {
                updateUser(response.data.data);
            }
            alert.success('Profile updated successfully');
            setEditing(false);
        } catch (error) {
            alert.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            licenseNumber: user.licenseNumber || ''
        });
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white/30">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-blue-100 mt-1 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {user?.role === 'admin' ? 'Administrator' : 'Driver'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="h-4 w-4 inline mr-2" />
                                First Name
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.firstName || 'N/A'}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="h-4 w-4 inline mr-2" />
                                Last Name
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.lastName || 'N/A'}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="h-4 w-4 inline mr-2" />
                                Email Address
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.email || 'N/A'}</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="h-4 w-4 inline mr-2" />
                                Phone Number
                            </label>
                            {editing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.phone || 'Not set'}</p>
                            )}
                        </div>

                        {/* License Number (for drivers) */}
                        {user?.role === 'driver' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4 inline mr-2" />
                                    License Number
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="DL-123456789"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{user?.licenseNumber || 'Not set'}</p>
                                )}
                            </div>
                        )}

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Shield className="h-4 w-4 inline mr-2" />
                                Role
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">{user?.role || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Save Button */}
                    {editing && (
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Save className="h-5 w-5" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Account Status</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Member Since</span>
                        <span className="text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}