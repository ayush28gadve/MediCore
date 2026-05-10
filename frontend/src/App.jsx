import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="reports" element={<DoctorReports />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        } />

        {/* Reception Routes */}
        <Route path="/reception/*" element={
          <DashboardLayout role="reception">
            <Routes>
              <Route path="dashboard" element={<ReceptionDashboard />} />
              <Route path="appointments" element={<ReceptionAppointments />} />
              <Route path="patients" element={<ReceptionPatients />} />
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
