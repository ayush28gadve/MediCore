import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelection } from './pages/RoleSelection';
import { Login } from './pages/Login';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { ReceptionDashboard } from './pages/ReceptionDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login/:role" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <DashboardLayout role="admin">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/*" element={
          <DashboardLayout role="doctor">
            <Routes>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        } />

        {/* Reception Routes */}
        <Route path="/reception/*" element={
          <DashboardLayout role="reception">
            <Routes>
              <Route path="dashboard" element={<ReceptionDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
