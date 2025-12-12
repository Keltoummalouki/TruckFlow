import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layout/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - Role-based routing */}
          <Route
            path="dashboard"
            element={
              user?.role === 'admin' ? <AdminDashboard /> : <DriverDashboard />
            }
          />

          {/* Placeholder routes for navigation items */}
          <Route path="trips" element={<PlaceholderPage title="Trips Management" />} />
          <Route path="trucks" element={<PlaceholderPage title="Trucks Management" />} />
          <Route path="trailers" element={<PlaceholderPage title="Trailers Management" />} />
          <Route path="tires" element={<PlaceholderPage title="Tires Management" />} />
          <Route path="maintenance" element={<PlaceholderPage title="Maintenance" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="my-trips" element={<PlaceholderPage title="My Trips" />} />
          <Route path="profile" element={<PlaceholderPage title="My Profile" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />

          {/* Default redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Simple placeholder component for routes
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-600">This page is coming soon...</p>
      </div>
    </div>
  );
}

export default App;

