import React from 'react';
import { Calendar, UserPlus, PhoneCall, CheckCircle } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';

export function ReceptionDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reception Dashboard</h1>
        <p className="text-slate-500">Manage today's appointments and front-desk operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Scheduled Today"
          value="45"
          icon={Calendar}
          description="Appointments"
        />
        <DashboardCard
          title="Checked In"
          value="18"
          icon={CheckCircle}
          description="Patients waiting"
        />
        <DashboardCard
          title="New Registrations"
          value="12"
          icon={UserPlus}
          trend={15.0}
          description="vs yesterday"
        />
        <DashboardCard
          title="Active Calls"
          value="3"
          icon={PhoneCall}
          description="In queue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Waiting Room</h3>
            <button className="text-sm font-medium text-[#0ea5e9] hover:text-[#0284c7]">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { token: 'A-102', patient: 'John Doe', doctor: 'Dr. Smith', waitTime: '15 mins' },
              { token: 'B-045', patient: 'Alice Cooper', doctor: 'Dr. Johnson', waitTime: '10 mins' },
              { token: 'A-103', patient: 'Bob Builder', doctor: 'Dr. Smith', waitTime: '5 mins' },
            ].map((pt, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-[#0ea5e9] bg-blue-50 px-3 py-1 rounded-md">{pt.token}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{pt.patient}</p>
                    <p className="text-xs text-slate-500">Seeing: {pt.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">Wait Time</p>
                  <p className="text-sm font-semibold text-amber-600">{pt.waitTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
             <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
               <span className="font-medium text-slate-700">Register Patient</span>
               <UserPlus size={18} className="text-slate-400" />
             </button>
             <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
               <span className="font-medium text-slate-700">Book Appointment</span>
               <Calendar size={18} className="text-slate-400" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
