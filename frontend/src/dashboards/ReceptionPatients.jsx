import React, { useState } from 'react';
import { 
  Users, UserPlus, Activity, RotateCw, Search, Filter,
  FileText, Eye, Calendar, CalendarPlus, X, Edit2, CheckCircle2,
  Phone, MapPin, Droplet, ShieldAlert, HeartPulse, Clock, FileSymlink,
  Pill, FileBox, FileArchive, Download
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { cn } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

// Comprehensive Deep Dummy Data
const MOCK_PATIENTS_DB = [
  {
    patientId: 'MC-001',
    fullName: 'Rahul Patil',
    age: '32',
    gender: 'Male',
    phone: '9876543210',
    bloodGroup: 'A+',
    address: '101, Shivneri Appt, Kothrud, Pune',
    status: 'Active',
    lastVisit: '2026-05-08',
    assignedDoctor: 'Dr. Emily Chen',
    medicalHistory: 'Chronic Asthma since 2020.',
    allergies: 'Dust, Pollen',
    currentMedications: 'Salbutamol Inhaler (SOS), Montelukast 10mg OD',
    visitHistory: [
      { date: '2026-05-08', doctor: 'Dr. Emily Chen', diagnosis: 'Mild Asthma Exacerbation', notes: 'Patient reported increased wheezing at night. Prescribed SOS inhaler.' },
      { date: '2026-01-12', doctor: 'Dr. Michael Smith', diagnosis: 'Viral Fever', notes: 'High temp (102F). Advised rest and paracetamol.' },
      { date: '2025-08-20', doctor: 'Dr. Emily Chen', diagnosis: 'Routine Asthma Review', notes: 'Lungs clear. Continuing current medication.' }
    ],
    prescriptions: [
      { date: '2026-05-08', medicines: 'Salbutamol Inhaler', dosage: '2 puffs SOS', doctor: 'Dr. Emily Chen' },
      { date: '2026-05-08', medicines: 'Montelukast 10mg', dosage: '1 tablet night', doctor: 'Dr. Emily Chen' },
      { date: '2026-01-12', medicines: 'Paracetamol 500mg', dosage: '1-1-1 for 3 days', doctor: 'Dr. Michael Smith' }
    ],
    reports: [
      { date: '2026-05-08', name: 'Pulmonary Function Test.pdf', type: 'Lab Report', size: '2.4 MB' },
      { date: '2026-01-12', name: 'CBC Blood Panel.pdf', type: 'Blood Test', size: '1.1 MB' }
    ],
    followUps: [
      { date: '2026-05-22', reason: 'Asthma Progress Review', status: 'Upcoming' },
      { date: '2025-09-01', reason: 'Post-review check', status: 'Completed' }
    ]
  },
  {
    patientId: 'MC-002',
    fullName: 'Shubham Kale',
    age: '45',
    gender: 'Male',
    phone: '9123456780',
    bloodGroup: 'O-',
    address: '45, Laxmi Road, Pune',
    status: 'Under Treatment',
    lastVisit: '2026-04-15',
    assignedDoctor: 'Dr. Amit Sharma',
    medicalHistory: 'Hypertension detected 2023.',
    allergies: 'None',
    currentMedications: 'Telmisartan 40mg (1 OD)',
    visitHistory: [
      { date: '2026-04-15', doctor: 'Dr. Amit Sharma', diagnosis: 'Elevated BP (150/95)', notes: 'Increased dosage. Advised low sodium diet.' },
      { date: '2025-09-10', doctor: 'Dr. Amit Sharma', diagnosis: 'Routine BP Check', notes: 'BP stable at 130/85.' }
    ],
    prescriptions: [
      { date: '2026-04-15', medicines: 'Telmisartan 40mg', dosage: '1 tablet morning', doctor: 'Dr. Amit Sharma' }
    ],
    reports: [
      { date: '2026-04-15', name: 'ECG Report.pdf', type: 'Cardiology', size: '3.1 MB' },
      { date: '2025-09-10', name: 'Lipid Profile.pdf', type: 'Blood Test', size: '1.5 MB' }
    ],
    followUps: [
      { date: '2026-05-15', reason: 'BP Monitoring', status: 'Upcoming' }
    ]
  },
  {
    patientId: 'MC-003',
    fullName: 'Amit Sharma',
    age: '28',
    gender: 'Male',
    phone: '9988776655',
    bloodGroup: 'B+',
    address: '22, Baner Road, Pune',
    status: 'Follow-Up',
    lastVisit: '2026-05-02',
    assignedDoctor: 'Dr. Sarah Wilson',
    medicalHistory: 'None',
    allergies: 'Penicillin',
    currentMedications: 'Hydrocortisone Cream 1%',
    visitHistory: [
      { date: '2026-05-02', doctor: 'Dr. Sarah Wilson', diagnosis: 'Contact Dermatitis', notes: 'Red rash on right forearm. Prescribed topical steroids.' }
    ],
    prescriptions: [
      { date: '2026-05-02', medicines: 'Hydrocortisone Cream 1%', dosage: 'Apply twice daily', doctor: 'Dr. Sarah Wilson' },
      { date: '2026-05-02', medicines: 'Cetirizine 10mg', dosage: '1 tablet night (SOS)', doctor: 'Dr. Sarah Wilson' }
    ],
    reports: [],
    followUps: [
      { date: '2026-05-12', reason: 'Rash check', status: 'Upcoming' }
    ]
  },
  {
    patientId: 'MC-004',
    fullName: 'Priya Deshmukh',
    age: '35',
    gender: 'Female',
    phone: '9011223344',
    bloodGroup: 'AB+',
    address: '11/A, Kalyani Nagar, Pune',
    status: 'Inactive',
    lastVisit: '2026-02-28',
    assignedDoctor: 'Dr. Emily Chen',
    medicalHistory: 'Hypothyroidism',
    allergies: 'Sulfa Drugs',
    currentMedications: 'Levothyroxine 50mcg',
    visitHistory: [
      { date: '2026-02-28', doctor: 'Dr. Emily Chen', diagnosis: 'Hypothyroidism Management', notes: 'Levels normal. Continue 50mcg dosage.' },
      { date: '2025-11-15', doctor: 'Dr. Michael Smith', diagnosis: 'Migraine', notes: 'Prescribed pain relievers. Advised hydration.' }
    ],
    prescriptions: [
      { date: '2026-02-28', medicines: 'Levothyroxine 50mcg', dosage: '1 tablet empty stomach', doctor: 'Dr. Emily Chen' },
      { date: '2025-11-15', medicines: 'Naproxen 500mg', dosage: '1 tablet SOS for headache', doctor: 'Dr. Michael Smith' }
    ],
    reports: [
      { date: '2026-02-28', name: 'Thyroid Panel (TSH, T3, T4).pdf', type: 'Blood Test', size: '1.2 MB' }
    ],
    followUps: [
      { date: '2026-08-28', reason: '6-Month Thyroid Check', status: 'Upcoming' }
    ]
  }
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Under Treatment': 'bg-blue-50 text-blue-700 border-blue-200',
    'Follow-Up': 'bg-amber-50 text-amber-700 border-amber-200',
    'Inactive': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center w-fit", styles[status])}>
      {status === 'Active' && <Activity size={12} className="mr-1" />}
      {status === 'Under Treatment' && <HeartPulse size={12} className="mr-1" />}
      {status === 'Follow-Up' && <RotateCw size={12} className="mr-1" />}
      {status === 'Inactive' && <CheckCircle2 size={12} className="mr-1" />}
      {status}
    </span>
  );
};

export function ReceptionPatients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterDoctor, setFilterDoctor] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modal State
  const [activePatient, setActivePatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Reappointment Form State (in modal)
  const [reappointmentData, setReappointmentData] = useState({
    symptoms: '', doctor: '', date: '', time: ''
  });
  const [showToast, setShowToast] = useState(false);

  // Filter Logic
  const filteredPatients = MOCK_PATIENTS_DB.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.phone.includes(searchQuery);
    const matchesBg = filterBloodGroup === 'All' || p.bloodGroup === filterBloodGroup;
    const matchesGender = filterGender === 'All' || p.gender === filterGender;
    const matchesDoctor = filterDoctor === 'All' || p.assignedDoctor === filterDoctor;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    
    return matchesSearch && matchesBg && matchesGender && matchesDoctor && matchesStatus;
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleCreateReappointment = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    // Reset form
    setReappointmentData({ symptoms: '', doctor: '', date: '', time: '' });
  };

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-4 max-w-md flex items-start space-x-4">
            <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900">Reappointment Created!</h4>
              <p className="text-xs text-slate-500 mt-1">Patient has been added to the appointments queue.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients Management</h1>
          <p className="text-slate-500 mt-1">Central database of all registered hospital profiles &bull; {currentDate}</p>
        </div>
        <Button onClick={() => navigate('/reception/dashboard')} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md">
          <UserPlus size={18} className="mr-2" /> Add New Patient
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Registered" value="12,450" icon={Users} trend={2.4} description="Lifetime records" />
        <DashboardCard title="New This Week" value="184" icon={UserPlus} trend={12} description="Vs previous week" />
        <DashboardCard title="Active Patients" value="842" icon={Activity} description="Currently under care" />
        <DashboardCard title="Follow-Up Patients" value="156" icon={RotateCw} description="Scheduled for review" />
      </div>

      {/* Main Database Area */}
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
                placeholder="Search by Name, Patient ID, or Mobile..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 sm:flex gap-3">
              <select value={filterBloodGroup} onChange={(e) => setFilterBloodGroup(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]">
                <option value="All">Blood Group</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
              </select>
              <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]">
                <option value="All">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} className="col-span-2 sm:col-span-1 px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]">
                <option value="All">Assigned Doctor</option>
                <option value="Dr. Emily Chen">Dr. Emily Chen</option>
                <option value="Dr. Amit Sharma">Dr. Amit Sharma</option>
                <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="col-span-2 sm:col-span-1 px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]">
                <option value="All">Patient Status</option>
                <option value="Active">Active</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient Name</th>
                <th className="px-6 py-4 font-semibold">Age/Gen</th>
                <th className="px-6 py-4 font-semibold">Mobile</th>
                <th className="px-6 py-4 font-semibold">Last Visit</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.patientId} className="bg-white border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={`https://i.pravatar.cc/150?u=${p.patientId}`} alt={p.fullName} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{p.fullName}</span>
                          <span className="text-xs font-mono text-slate-500">{p.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{p.age}y &bull; {p.gender.charAt(0)}</td>
                    <td className="px-6 py-4 text-slate-700">{p.phone}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 block">{p.lastVisit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setActivePatient(p); setActiveTab('overview'); }} className="h-8 text-xs font-medium text-[#0ea5e9] border-[#0ea5e9]/30 hover:bg-[#0ea5e9] hover:text-white">
                          <Eye size={14} className="mr-1.5" /> Profile
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setActivePatient(p); setActiveTab('reappointment'); }} className="h-8 text-xs font-medium text-slate-500 hover:text-slate-900 bg-slate-100">
                          <CalendarPlus size={14} className="mr-1.5" /> Book
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL PATIENT PROFILE MODAL (TABBED INTERFACE)               */}
      {/* ========================================================= */}
      {activePatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <img src={`https://i.pravatar.cc/150?u=${activePatient.patientId}`} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activePatient.fullName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
                    <span className="font-mono">{activePatient.patientId}</span>
                    <span>&bull;</span>
                    <StatusBadge status={activePatient.status} />
                  </div>
                </div>
              </div>
              <button onClick={() => setActivePatient(null)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Sidebar Tabs */}
              <div className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-2 overflow-y-auto flex-shrink-0">
                {[
                  { id: 'overview', icon: Activity, label: 'Overview' },
                  { id: 'history', icon: Clock, label: 'Visit History' },
                  { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
                  { id: 'reports', icon: FileSymlink, label: 'Lab Reports' },
                  { id: 'reappointment', icon: CalendarPlus, label: 'Reappointment' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                      activeTab === tab.id 
                        ? "bg-white text-[#0ea5e9] shadow-sm border border-slate-200" 
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent"
                    )}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? "text-[#0ea5e9]" : "text-slate-400"} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Main Tab Content */}
              <div className="flex-1 bg-white overflow-y-auto p-6 md:p-8">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Basic Information</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div><p className="text-xs text-slate-500 font-medium">Age</p><p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.age} Years</p></div>
                        <div><p className="text-xs text-slate-500 font-medium">Gender</p><p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.gender}</p></div>
                        <div><p className="text-xs text-slate-500 font-medium flex items-center"><Droplet size={12} className="mr-1 text-red-500"/> Blood Group</p><p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.bloodGroup}</p></div>
                        <div><p className="text-xs text-slate-500 font-medium flex items-center"><Phone size={12} className="mr-1"/> Mobile Number</p><p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.phone}</p></div>
                        <div className="col-span-2 md:col-span-4"><p className="text-xs text-slate-500 font-medium flex items-center"><MapPin size={12} className="mr-1"/> Address</p><p className="text-sm font-medium text-slate-900 mt-1">{activePatient.address}</p></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Medical Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 flex items-center"><Activity size={14} className="mr-1.5"/> Past Medical History</p>
                          <p className="text-sm font-medium text-slate-900">{activePatient.medicalHistory || 'No significant history.'}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wider mb-2 flex items-center"><ShieldAlert size={14} className="mr-1.5"/> Known Allergies</p>
                          <p className="text-sm font-medium text-slate-900">{activePatient.allergies || 'None recorded.'}</p>
                        </div>
                        <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <p className="text-xs text-blue-700 font-medium uppercase tracking-wider mb-2 flex items-center"><Pill size={14} className="mr-1.5"/> Current Active Medications</p>
                          <p className="text-sm font-medium text-slate-900">{activePatient.currentMedications}</p>
                        </div>
                      </div>
                    </div>

                    {activePatient.followUps.length > 0 && (
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Follow-Up Schedule</h4>
                        <div className="space-y-3">
                          {activePatient.followUps.map((f, i) => (
                            <div key={i} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{f.reason}</p>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{f.date}</p>
                              </div>
                              <span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold", f.status === 'Upcoming' ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600")}>{f.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. VISIT HISTORY TAB */}
                {activeTab === 'history' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">Patient Visit Timeline</h4>
                    <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
                      {activePatient.visitHistory.map((visit, idx) => (
                        <div key={idx} className="relative pl-8">
                          <div className="absolute w-4 h-4 bg-white border-2 border-[#0ea5e9] rounded-full -left-[9px] top-1"></div>
                          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-slate-100 pb-3">
                              <span className="text-sm font-bold text-[#0ea5e9] bg-blue-50 px-3 py-1 rounded-md">{visit.date}</span>
                              <span className="text-sm font-semibold text-slate-700 mt-2 sm:mt-0 flex items-center"><Stethoscope size={14} className="mr-1.5 text-slate-400" /> {visit.doctor}</span>
                            </div>
                            <h5 className="text-base font-bold text-slate-900 mb-2">{visit.diagnosis}</h5>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{visit.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PRESCRIPTIONS TAB */}
                {activeTab === 'prescriptions' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">Prescription Records</h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Medicine</th>
                            <th className="px-6 py-4 font-semibold">Dosage</th>
                            <th className="px-6 py-4 font-semibold">Prescribed By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activePatient.prescriptions.map((px, i) => (
                            <tr key={i} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-700">{px.date}</td>
                              <td className="px-6 py-4 font-semibold text-slate-900">{px.medicines}</td>
                              <td className="px-6 py-4 text-slate-600 bg-amber-50/50">{px.dosage}</td>
                              <td className="px-6 py-4 text-slate-700">{px.doctor}</td>
                            </tr>
                          ))}
                          {activePatient.prescriptions.length === 0 && (
                            <tr><td colSpan="4" className="text-center p-8 text-slate-500">No prescriptions recorded.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. REPORTS TAB */}
                {activeTab === 'reports' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
                      Lab & Diagnostic Reports
                      <Button variant="outline" size="sm" className="bg-white"><FileBox size={14} className="mr-2"/> Upload New Report</Button>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activePatient.reports.map((rep, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#0ea5e9] hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex items-center space-x-4">
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl group-hover:bg-red-100 transition-colors">
                              <FileArchive size={24} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{rep.name}</p>
                              <div className="flex items-center text-xs text-slate-500 font-medium space-x-2 mt-1">
                                <span>{rep.date}</span>
                                <span>&bull;</span>
                                <span>{rep.type}</span>
                                <span>&bull;</span>
                                <span>{rep.size}</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-[#0ea5e9] p-2"><Download size={18} /></button>
                        </div>
                      ))}
                      {activePatient.reports.length === 0 && (
                        <div className="col-span-2 text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                          <FileSymlink size={32} className="mx-auto text-slate-400 mb-3" />
                          <p className="text-slate-500 font-medium">No reports uploaded yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. REAPPOINTMENT TAB */}
                {activeTab === 'reappointment' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Create Reappointment</h4>
                    <p className="text-sm text-slate-500 mb-6">Patient details are auto-filled. Select doctor and schedule below.</p>
                    
                    <form onSubmit={handleCreateReappointment} className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <Input label="Patient Name (Auto-filled)" value={activePatient.fullName} disabled className="bg-slate-100 font-medium" />
                      
                      <Input 
                        label="Current Symptoms / Reason" 
                        value={reappointmentData.symptoms} 
                        onChange={(e) => setReappointmentData({...reappointmentData, symptoms: e.target.value})} 
                        placeholder="Fever, Routine Follow-up..." 
                        required 
                      />
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Assign Doctor</label>
                        <select 
                          value={reappointmentData.doctor} 
                          onChange={(e) => setReappointmentData({...reappointmentData, doctor: e.target.value})} 
                          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" 
                          required
                        >
                          <option value="">Select Doctor</option>
                          <option value="Dr. Emily Chen">Dr. Emily Chen (Pulmonology)</option>
                          <option value="Dr. Amit Sharma">Dr. Amit Sharma (Cardiology)</option>
                          <option value="Dr. Sarah Wilson">Dr. Sarah Wilson (Dermatology)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Date" type="date" 
                          value={reappointmentData.date} 
                          onChange={(e) => setReappointmentData({...reappointmentData, date: e.target.value})} 
                          required 
                        />
                        <Input 
                          label="Time" type="time" 
                          value={reappointmentData.time} 
                          onChange={(e) => setReappointmentData({...reappointmentData, time: e.target.value})} 
                          required 
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <Button type="submit" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6">
                          <CheckCircle2 size={18} className="mr-2" /> Book Appointment
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
