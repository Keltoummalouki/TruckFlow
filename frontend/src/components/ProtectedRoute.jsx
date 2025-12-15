import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, token } = useAuth();

    // Not authenticated
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Access Denied
                    </h2>
                    <p className="text-slate-600 mb-6">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-slate-500">
                        This page requires <span className="font-semibold">{allowedRoles.join(' or ')}</span> role.
                    </p>
                </div>
            </div>
        );
    }

    return children;
}
