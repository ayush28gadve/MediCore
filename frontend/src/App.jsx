import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSelection } from './pages/RoleSelection';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { DoctorAppointments } from './dashboards/DoctorAppointments';
import { DoctorPatients } from './dashboards/DoctorPatients';
import { DoctorReports } from './dashboards/DoctorReports';
import { ReceptionDashboard } from './dashboards/ReceptionDashboard';
import { ReceptionAppointments } from './dashboards/ReceptionAppointments';
import { ReceptionPatients } from './dashboards/ReceptionPatients';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login/:role" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/*" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DashboardLayout role="doctor">
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="appointments" element={<DoctorAppointments />} />
                  <Route path="patients" element={<DoctorPatients />} />
                  <Route path="reports" element={<DoctorReports />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Reception Routes */}
          <Route path="/reception/*" element={
            <ProtectedRoute allowedRoles={['reception', 'admin']}>
              <DashboardLayout role="reception">
                <Routes>
                  <Route path="dashboard" element={<ReceptionDashboard />} />
                  <Route path="appointments" element={<ReceptionAppointments />} />
                  <Route path="patients" element={<ReceptionPatients />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
