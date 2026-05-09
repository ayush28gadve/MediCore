import React from 'react';
import { Calendar, Users, FileText, Activity } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';

export function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-slate-500">Good morning, Dr. Smith! Here is your schedule for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Today's Appointments"
          value="12"
          icon={Calendar}
          description="3 pending"
        />
        <DashboardCard
          title="Total Patients"
          value="1,248"
          icon={Users}
          trend={5.2}
          description="vs last month"
        />
        <DashboardCard
          title="Pending Reports"
          value="5"
          icon={FileText}
          description="Needs attention"
        />
        <DashboardCard
          title="Avg. Consultation"
          value="18m"
          icon={Activity}
          trend={-2.1}
          description="vs last week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', patient: 'Sarah Johnson', type: 'Checkup', status: 'Completed' },
              { time: '10:30 AM', patient: 'Michael Brown', type: 'Follow-up', status: 'In Progress' },
              { time: '11:15 AM', patient: 'Emily Davis', type: 'Consultation', status: 'Waiting' },
              { time: '02:00 PM', patient: 'Robert Wilson', type: 'Report Review', status: 'Scheduled' },
            ].map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-slate-500 w-20">{apt.time}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{apt.patient}</p>
                    <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  apt.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {apt.status}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Patients</h3>
          <div className="space-y-4">
             {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                  {String.fromCharCode(64 + i)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Patient Name</p>
                  <p className="text-xs text-slate-500">ID: MC-{1000 + i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
