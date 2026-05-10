import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, Clock, CheckCircle2, RotateCw, 
  Search, Calendar, Stethoscope, Edit
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { cn } from '../utils/utils';

const MOCK_APPOINTMENTS = [
  { queueNo: 'Q-01', patientId: 'MC-001', fullName: 'Rahul Patil', time: '09:00 AM', status: 'Completed', reason: 'Mild Asthma Exacerbation' },
  { queueNo: 'Q-02', patientId: 'MC-002', fullName: 'Shubham Kale', time: '09:30 AM', status: 'In Consultation', reason: 'Routine BP checkup' },
  { queueNo: 'Q-03', patientId: 'MC-003', fullName: 'Amit Sharma', time: '10:00 AM', status: 'Waiting', reason: 'Contact Dermatitis follow-up' },
  { queueNo: 'Q-04', patientId: 'MC-004', fullName: 'Priya Deshmukh', time: '10:30 AM', status: 'Follow-Up', reason: 'Thyroid profile review' },
  { queueNo: 'Q-05', patientId: 'MC-005', fullName: 'Vikram Singh', time: '11:00 AM', status: 'Waiting', reason: 'Chest pain evaluation' },
  { queueNo: 'Q-06', patientId: 'MC-006', fullName: 'Neha Gupta', time: '11:30 AM', status: 'Waiting', reason: 'Migraine consultation' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Waiting': 'bg-amber-50 text-amber-700 border-amber-200',
    'In Consultation': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Follow-Up': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center w-fit", styles[status])}>
      {status}
    </span>
  );
};

export function DoctorAppointments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredAppointments = MOCK_APPOINTMENTS.filter(apt => {
    const matchesSearch = apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleOpenConsultation = () => {
    // Navigate to the main dashboard workspace where the full consultation logic resides
    navigate('/doctor/dashboard');
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Appointments</h1>
          <p className="text-slate-500 mt-1">Today's Schedule &bull; {currentDate}</p>
        </div>
        <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <Calendar className="text-[#0ea5e9]" size={20} />
          <span className="text-sm font-semibold text-blue-800">12 Total Scheduled</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Appointments" value="12" icon={CalendarCheck} description="Scheduled for today" />
        <DashboardCard title="Completed" value="4" icon={CheckCircle2} description="Consultations finished" />
        <DashboardCard title="Pending" value="6" icon={Clock} description="Waiting in queue" />
        <DashboardCard title="Follow-Ups" value="2" icon={RotateCw} description="Review sessions" />
      </div>

      {/* Appointments Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></div>
            <input 
              type="text" placeholder="Search by Patient Name or ID..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>
          <div className="flex gap-3">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]">
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Completed">Completed</option>
              <option value="Follow-Up">Follow-Up</option>
            </select>
            <input type="date" className="px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Queue No</th>
                <th className="px-6 py-4 font-semibold">Patient Details</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Symptoms</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.queueNo} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-700">{apt.queueNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={`https://i.pravatar.cc/150?u=${apt.patientId}`} alt={apt.fullName} className="w-8 h-8 rounded-full border border-slate-200" />
                        <div>
                          <p className="font-semibold text-slate-900">{apt.fullName}</p>
                          <p className="text-xs font-mono text-slate-500">{apt.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{apt.time}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={apt.reason}>{apt.reason}</td>
                    <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {apt.status !== 'Completed' && (
                          <Button onClick={handleOpenConsultation} size="sm" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-8 text-xs">
                            <Stethoscope size={14} className="mr-1.5" /> Open
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600">
                          <Edit size={14} className="mr-1.5" /> Reschedule
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No appointments match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
