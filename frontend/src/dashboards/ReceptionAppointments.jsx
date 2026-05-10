import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CalendarClock, 
  Check, 
  X,
  Stethoscope,
  Activity,
  User,
  Plus
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { cn } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

// Realistic Dummy Appointments Data
const MOCK_APPOINTMENTS = [
  {
    id: 'APT-1001',
    queueNo: 'Queue #1',
    patientId: 'MC-001',
    patientName: 'Rahul Patil',
    patientImg: 'https://i.pravatar.cc/150?u=MC-001',
    doctor: 'Dr. Emily Chen',
    date: '2026-05-10',
    time: '09:00 AM',
    status: 'In Consultation',
    symptoms: 'Mild Asthma Exacerbation, shortness of breath',
    notes: 'Patient arrived 15 mins early. Vitals checked by nurse.',
    history: 'Chronic Asthma since 2020. Last visit 8 May 2026.'
  },
  {
    id: 'APT-1002',
    queueNo: 'Queue #2',
    patientId: 'MC-002',
    patientName: 'Shubham Kale',
    patientImg: 'https://i.pravatar.cc/150?u=MC-002',
    doctor: 'Dr. Amit Sharma',
    date: '2026-05-10',
    time: '09:30 AM',
    status: 'Waiting',
    symptoms: 'Routine BP checkup, reported mild dizziness',
    notes: 'BP currently stable. Waiting for ECG results.',
    history: 'Hypertension. On Telmisartan 40mg.'
  },
  {
    id: 'APT-1003',
    queueNo: 'Queue #3',
    patientId: 'MC-003',
    patientName: 'Amit Sharma',
    patientImg: 'https://i.pravatar.cc/150?u=MC-003',
    doctor: 'Dr. Sarah Wilson',
    date: '2026-05-10',
    time: '10:00 AM',
    status: 'Completed',
    symptoms: 'Contact Dermatitis follow-up',
    notes: 'Rash has significantly reduced. Advised to continue cream for 3 more days.',
    history: 'Allergic to Penicillin.'
  },
  {
    id: 'APT-1004',
    queueNo: 'Queue #4',
    patientId: 'MC-004',
    patientName: 'Priya Deshmukh',
    patientImg: 'https://i.pravatar.cc/150?u=MC-004',
    doctor: 'Dr. Emily Chen',
    date: '2026-05-10',
    time: '10:30 AM',
    status: 'Upcoming',
    symptoms: 'Thyroid profile review',
    notes: 'Reports awaited from path lab.',
    history: 'Hypothyroidism Management.'
  },
  {
    id: 'APT-1005',
    queueNo: 'Queue #5',
    patientId: 'MC-005',
    patientName: 'Karan Singh',
    patientImg: 'https://i.pravatar.cc/150?u=MC-005',
    doctor: 'Dr. Amit Sharma',
    date: '2026-05-10',
    time: '11:00 AM',
    status: 'Cancelled',
    symptoms: 'Chest pain evaluation',
    notes: 'Patient cancelled due to personal emergency.',
    history: 'First visit.'
  }
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Waiting': 'bg-amber-50 text-amber-700 border-amber-200',
    'In Consultation': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200',
    'Upcoming': 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center w-fit", styles[status])}>
      {status === 'Waiting' && <Clock size={12} className="mr-1" />}
      {status === 'In Consultation' && <Activity size={12} className="mr-1" />}
      {status === 'Completed' && <CheckCircle2 size={12} className="mr-1" />}
      {status === 'Cancelled' && <XCircle size={12} className="mr-1" />}
      {status === 'Upcoming' && <CalendarClock size={12} className="mr-1" />}
      {status}
    </span>
  );
};

export function ReceptionAppointments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  
  // Modal State
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filter Logic
  const filteredAppointments = MOCK_APPOINTMENTS.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoctor = filterDoctor === 'All' || apt.doctor === filterDoctor;
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchesDate = !filterDate || apt.date === filterDate;
    
    return matchesSearch && matchesDoctor && matchesStatus && matchesDate;
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments Management</h1>
          <p className="text-slate-500 mt-1">Manage today's queues and schedule flows &bull; {currentDate}</p>
        </div>
        <Button onClick={() => navigate('/reception/dashboard')} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md">
          <Plus size={18} className="mr-2" /> New Appointment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Today's Appointments" value="48" icon={Calendar} trend={5} description="Total scheduled for today" />
        <DashboardCard title="Completed" value="12" icon={CheckCircle2} description="Appointments finished" />
        <DashboardCard title="Pending / Waiting" value="34" icon={Clock} description="Currently in queue" />
        <DashboardCard title="Cancelled" value="2" icon={XCircle} description="Patient no-shows or cancelled" />
      </div>

      {/* Main Appointments Operations Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative z-10">
        
        {/* Search & Filters Section */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search patient name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Stethoscope size={16} /></div>
                <select 
                  value={filterDoctor} 
                  onChange={(e) => setFilterDoctor(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none min-w-[160px]"
                >
                  <option value="All">All Doctors</option>
                  <option value="Dr. Emily Chen">Dr. Emily Chen</option>
                  <option value="Dr. Amit Sharma">Dr. Amit Sharma</option>
                  <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Filter size={16} /></div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none min-w-[160px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Waiting">Waiting</option>
                  <option value="In Consultation">In Consultation</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
              />
            </div>

          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Queue</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Doctor</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="bg-white border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{apt.queueNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={apt.patientImg} alt={apt.patientName} className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{apt.patientName}</span>
                          <span className="text-xs font-mono text-slate-500">{apt.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{apt.doctor}</td>
                    <td className="px-6 py-4">
                      <span className="block text-slate-900">{apt.date}</span>
                      <span className="text-xs text-slate-500">{apt.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => setSelectedAppointment(apt)}
                          className="p-1.5 text-slate-400 hover:text-[#0ea5e9] rounded-md hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors" title="Mark Complete">
                          <Check size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md hover:bg-amber-50 transition-colors" title="Reschedule">
                          <CalendarClock size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors" title="Cancel Appointment">
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    No appointments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Appointment Details</h3>
                  <p className="text-sm font-mono text-slate-500">{selectedAppointment.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAppointment(null)} 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Split Pane */}
            <div className="flex flex-col md:flex-row h-full max-h-[70vh] overflow-hidden">
              
              {/* Left Pane - Patient Info */}
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto bg-white">
                <div className="flex items-center space-x-4 mb-6">
                  <img src={selectedAppointment.patientImg} alt="Profile" className="w-16 h-16 rounded-xl border border-slate-200 object-cover shadow-sm" />
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{selectedAppointment.patientName}</h4>
                    <p className="text-sm font-mono text-slate-500">{selectedAppointment.patientId}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h5 className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wider mb-2">Current Symptoms</h5>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {selectedAppointment.symptoms}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wider mb-2">Medical Background</h5>
                    <p className="text-sm text-slate-700">{selectedAppointment.history}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wider mb-2">Reception Notes</h5>
                    <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Pane - Timeline & Actions */}
              <div className="w-full md:w-80 p-6 bg-slate-50 overflow-y-auto flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Appointment Status</h5>
                  
                  <div className="mb-6">
                    <StatusBadge status={selectedAppointment.status} />
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-xs text-slate-500">Queue Placement</p>
                      <p className="text-base font-mono font-bold text-slate-900 mt-1">{selectedAppointment.queueNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Assigned Doctor</p>
                      <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center">
                        <Stethoscope size={14} className="mr-2 text-slate-400" />
                        {selectedAppointment.doctor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Scheduled Time</p>
                      <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center">
                        <Clock size={14} className="mr-2 text-slate-400" />
                        {selectedAppointment.date} at {selectedAppointment.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <Button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white">
                    Update Details
                  </Button>
                  <Button variant="outline" className="w-full">
                    Print Slip
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
