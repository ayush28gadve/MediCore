import React, { useState } from 'react';
import { 
  Users, Activity, Search, Eye, CalendarPlus, X, Edit2, CheckCircle2,
  Phone, MapPin, Droplet, ShieldAlert, HeartPulse, Clock, FileSymlink, Pill
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { cn } from '../utils/utils';

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
    ],
    prescriptions: [
      { date: '2026-05-08', medicines: 'Salbutamol Inhaler', dosage: '2 puffs SOS', doctor: 'Dr. Emily Chen' },
      { date: '2026-05-08', medicines: 'Montelukast 10mg', dosage: '1 tablet night', doctor: 'Dr. Emily Chen' },
    ],
    reports: [
      { date: '2026-05-08', name: 'Pulmonary Function Test.pdf', type: 'Lab Report', size: '2.4 MB' },
    ],
    followUps: [
      { date: '2026-05-22', reason: 'Asthma Progress Review', status: 'Upcoming' },
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
    ],
    prescriptions: [
      { date: '2026-04-15', medicines: 'Telmisartan 40mg', dosage: '1 tablet morning', doctor: 'Dr. Amit Sharma' }
    ],
    reports: [
      { date: '2026-04-15', name: 'ECG Report.pdf', type: 'Cardiology', size: '3.1 MB' },
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
      { date: '2026-05-02', doctor: 'Dr. Sarah Wilson', diagnosis: 'Contact Dermatitis', notes: 'Red rash on right forearm.' }
    ],
    prescriptions: [
      { date: '2026-05-02', medicines: 'Hydrocortisone Cream 1%', dosage: 'Apply twice daily', doctor: 'Dr. Sarah Wilson' },
    ],
    reports: [],
    followUps: []
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
      { date: '2026-02-28', doctor: 'Dr. Emily Chen', diagnosis: 'Hypothyroidism Management', notes: 'Levels normal.' }
    ],
    prescriptions: [
      { date: '2026-02-28', medicines: 'Levothyroxine 50mcg', dosage: '1 OD', doctor: 'Dr. Emily Chen' },
    ],
    reports: [
      { date: '2026-02-28', name: 'Thyroid Panel.pdf', type: 'Blood Test', size: '1.2 MB' }
    ],
    followUps: []
  }
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Under Treatment': 'bg-blue-50 text-blue-700 border-blue-200',
    'Follow-Up': 'bg-amber-50 text-amber-700 border-amber-200',
    'Inactive': 'bg-slate-100 text-slate-600 border-slate-200'
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", styles[status])}>{status}</span>;
};

export function DoctorPatients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePatient, setActivePatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const filteredPatients = MOCK_PATIENTS_DB.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProfile = (patient) => {
    setActivePatient(patient);
    setEditData({ ...patient });
    setIsEditing(false);
    setActiveTab('overview');
  };

  const handleSave = () => {
    // In MVP, we just update local state to simulate save
    setActivePatient({ ...editData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-10 relative z-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Patients Database</h1>
          <p className="text-slate-500 mt-1">Complete patient records and medical histories</p>
        </div>
        <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <Users className="text-[#0ea5e9]" size={20} />
          <span className="text-sm font-semibold text-blue-800">128 Total Active Patients</span>
        </div>
      </div>

      {/* Main Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Search & Filters */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></div>
            <input 
              type="text" placeholder="Search by Patient Name or ID..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient Name</th>
                <th className="px-6 py-4 font-semibold">Age/Gen</th>
                <th className="px-6 py-4 font-semibold">Last Visit</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.patientId} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={`https://i.pravatar.cc/150?u=${p.patientId}`} alt={p.fullName} className="w-10 h-10 rounded-full border border-slate-200" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{p.fullName}</span>
                        <span className="text-xs font-mono text-slate-500">{p.patientId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{p.age}y &bull; {p.gender.charAt(0)}</td>
                  <td className="px-6 py-4 text-slate-900">{p.lastVisit}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => openProfile(p)} className="h-8 text-xs font-medium text-[#0ea5e9] border-[#0ea5e9]/30 hover:bg-[#0ea5e9] hover:text-white">
                      <Eye size={14} className="mr-1.5" /> Full Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL PATIENT PROFILE MODAL (TABBED INTERFACE)               */}
      {/* ========================================================= */}
      {activePatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <img src={`https://i.pravatar.cc/150?u=${activePatient.patientId}`} alt="Profile" className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activePatient.fullName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
                    <span className="font-mono">{activePatient.patientId}</span>
                    <span>&bull;</span>
                    <StatusBadge status={activePatient.status} />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm h-9">
                    <CheckCircle2 size={16} className="mr-2" /> Save Changes
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="h-9">
                    <Edit2 size={16} className="mr-2" /> Edit Records
                  </Button>
                )}
                <button onClick={() => setActivePatient(null)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Sidebar Tabs */}
              <div className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-2 overflow-y-auto">
                {[
                  { id: 'overview', icon: Activity, label: 'Medical Overview' },
                  { id: 'history', icon: Clock, label: 'Visit History' },
                  { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
                  { id: 'reports', icon: FileSymlink, label: 'Lab Reports' }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left", activeTab === tab.id ? "bg-white text-[#0ea5e9] shadow-sm border border-slate-200" : "text-slate-600 hover:bg-slate-200/50 border border-transparent")}>
                    <tab.icon size={18} className={activeTab === tab.id ? "text-[#0ea5e9]" : "text-slate-400"} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 bg-white overflow-y-auto p-6 md:p-8">
                
                {/* 1. OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Patient Demographics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Age</p>
                          {isEditing ? <Input value={editData.age} onChange={e=>setEditData({...editData, age:e.target.value})} className="h-8 mt-1" /> : <p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.age} Yrs</p>}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Gender</p>
                          {isEditing ? <Input value={editData.gender} onChange={e=>setEditData({...editData, gender:e.target.value})} className="h-8 mt-1" /> : <p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.gender}</p>}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium flex items-center"><Droplet size={12} className="mr-1 text-red-500"/> Blood Group</p>
                          {isEditing ? <Input value={editData.bloodGroup} onChange={e=>setEditData({...editData, bloodGroup:e.target.value})} className="h-8 mt-1" /> : <p className="text-sm font-bold text-slate-900 mt-1">{activePatient.bloodGroup}</p>}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium flex items-center"><Phone size={12} className="mr-1"/> Phone</p>
                          {isEditing ? <Input value={editData.phone} onChange={e=>setEditData({...editData, phone:e.target.value})} className="h-8 mt-1" /> : <p className="text-sm font-semibold text-slate-900 mt-1">{activePatient.phone}</p>}
                        </div>
                        <div className="col-span-2 md:col-span-4">
                          <p className="text-xs text-slate-500 font-medium flex items-center"><MapPin size={12} className="mr-1"/> Address</p>
                          {isEditing ? <Input value={editData.address} onChange={e=>setEditData({...editData, address:e.target.value})} className="mt-1" /> : <p className="text-sm font-medium text-slate-900 mt-1">{activePatient.address}</p>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Medical Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center"><Activity size={14} className="mr-1.5"/> Past Medical History</p>
                          {isEditing ? <textarea value={editData.medicalHistory} onChange={e=>setEditData({...editData, medicalHistory:e.target.value})} className="w-full border-slate-300 rounded text-sm p-2" /> : <p className="text-sm font-medium text-slate-900">{activePatient.medicalHistory}</p>}
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                          <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-2 flex items-center"><ShieldAlert size={14} className="mr-1.5"/> Known Allergies</p>
                          {isEditing ? <textarea value={editData.allergies} onChange={e=>setEditData({...editData, allergies:e.target.value})} className="w-full border-amber-200 rounded text-sm p-2" /> : <p className="text-sm font-medium text-amber-900">{activePatient.allergies}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VISIT HISTORY */}
                {activeTab === 'history' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">Clinical Visit Timeline</h4>
                    <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
                      {activePatient.visitHistory.map((visit, idx) => (
                        <div key={idx} className="relative pl-8">
                          <div className="absolute w-4 h-4 bg-white border-2 border-[#0ea5e9] rounded-full -left-[9px] top-1"></div>
                          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-slate-100 pb-3">
                              <span className="text-sm font-bold text-[#0ea5e9] bg-blue-50 px-3 py-1 rounded-md">{visit.date}</span>
                              <span className="text-sm font-semibold text-slate-700 mt-2 sm:mt-0">{visit.doctor}</span>
                            </div>
                            <h5 className="text-base font-bold text-slate-900 mb-2">{visit.diagnosis}</h5>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{visit.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PRESCRIPTIONS & REPORTS */}
                {(activeTab === 'prescriptions' || activeTab === 'reports') && (
                  <div className="animate-in fade-in duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-6 uppercase">{activeTab}</h4>
                    <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      <p className="text-slate-500 font-medium">Use the dedicated Reports Module to manage individual files.</p>
                    </div>
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
