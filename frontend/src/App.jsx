import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { TruckProvider } from './context/TruckContext';
import { TripProvider } from './context/TripContext';
import { TrailerProvider } from './context/TrailerContext';
import { TireProvider } from './context/TireContext';
import { MaintenanceProvider } from './context/MaintenanceContext';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layout/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import TrucksList from './pages/Trucks/TrucksList';
import TripsList from './pages/Trips/TripsList';
import TrailersList from './pages/Trailers/TrailersList';
import TiresList from './pages/Tires/TiresList';
import MaintenanceList from './pages/Maintenance/MaintenanceList';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Profile';
import MyTrips from './pages/Driver/MyTrips';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <TruckProvider>
        <TripProvider>
          <TrailerProvider>
            <TireProvider>
              <MaintenanceProvider>
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

                    {/* Admin Only Routes */}
                    <Route path="trucks" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <TrucksList />
                      </ProtectedRoute>
                    } />
                    <Route path="trips" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <TripsList />
                      </ProtectedRoute>
                    } />
                    <Route path="trailers" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <TrailersList />
                      </ProtectedRoute>
                    } />
                    <Route path="tires" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <TiresList />
                      </ProtectedRoute>
                    } />
                    <Route path="maintenance" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <MaintenanceList />
                      </ProtectedRoute>
                    } />
                    <Route path="reports" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="settings" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <PlaceholderPage title="Settings" />
                      </ProtectedRoute>
                    } />

                    {/* Driver Only Routes */}
                    <Route path="my-trips" element={
                      <ProtectedRoute allowedRoles={['driver']}>
                        <MyTrips />
                      </ProtectedRoute>
                    } />

                    {/* Shared Routes */}
                    <Route path="profile" element={<Profile />} />

                    {/* Default redirect */}
                    <Route index element={<Navigate to="/dashboard" replace />} />
                  </Route>

                  {/* Fallback redirect */}
                  <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                </Routes>
              </MaintenanceProvider>
            </TireProvider>
          </TrailerProvider>
        </TripProvider>
      </TruckProvider>
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

