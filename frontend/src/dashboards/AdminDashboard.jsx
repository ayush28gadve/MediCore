import React from 'react';
import { Users, Activity, Calendar, Stethoscope } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here's an overview of your hospital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Patients"
          value="2,845"
          icon={Users}
          trend={12.5}
          description="vs last month"
        />
        <DashboardCard
          title="Active Doctors"
          value="142"
          icon={Stethoscope}
          trend={2.4}
          description="vs last month"
        />
        <DashboardCard
          title="Today's Appointments"
          value="348"
          icon={Calendar}
          trend={-4.1}
          description="vs yesterday"
        />
        <DashboardCard
          title="Available Beds"
          value="84"
          icon={Activity}
          trend={0}
          description="out of 500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Overview</h3>
          <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-slate-400">Chart Placeholder</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#0ea5e9]"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New patient registered</p>
                  <p className="text-xs text-slate-500">10 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
