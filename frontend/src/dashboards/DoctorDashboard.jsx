import React, { useState } from 'react';
import { 
  Users, Activity, CalendarCheck, RotateCw, Stethoscope, Clock, 
  FileText, Plus, Save, Printer, Download, X, Edit2, CheckCircle2,
  AlertCircle, Syringe, Pill, History, FileSymlink, ChevronRight
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PrescriptionPrint } from '../components/PrescriptionPrint';
import { cn } from '../utils/utils';
import { appointmentService } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

// Removed MOCK_QUEUE

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

export function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeConsultation, setActiveConsultation] = useState(null);
  
  // Editable Patient Info State
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientData, setPatientData] = useState({});

  // Clinical Workflow State
  const [consultationData, setConsultationData] = useState({
    symptoms: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '' }],
    precautions: '',
    notes: '',
    followUpDate: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchQueue();
    }
  }, [user]);

  const fetchQueue = async () => {
    try {
      const data = await appointmentService.getDoctorAppointments(user._id);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch queue", error);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleOpenConsultation = async (appointment) => {
    const patient = appointment.patient;
    
    // Convert to flat structure for the UI
    const flatPatient = {
      ...patient,
      reason: appointment.symptoms,
      appointmentId: appointment._id,
      queueNo: appointment.queueNumber
    };

    setActiveConsultation(flatPatient);
    setPatientData({ ...flatPatient });
    setIsEditingPatient(false);
    
    // Auto-fill symptoms if provided by reception
    setConsultationData(prev => ({ ...prev, symptoms: appointment.symptoms }));

    // Change status to In Consultation
    try {
      await appointmentService.updateStatus(appointment._id, 'In Consultation');
      fetchQueue(); // refresh queue
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseConsultation = () => {
    setActiveConsultation(null);
    setConsultationData({
      symptoms: '', diagnosis: '', medicines: [{ name: '', dosage: '' }], precautions: '', notes: '', followUpDate: ''
    });
  };

  const handleAddMedicine = () => {
    setConsultationData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '' }]
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...consultationData.medicines];
    newMedicines[index][field] = value;
    setConsultationData(prev => ({ ...prev, medicines: newMedicines }));
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = [...consultationData.medicines];
    newMedicines.splice(index, 1);
    setConsultationData(prev => ({ ...prev, medicines: newMedicines }));
  };

  const handleSaveConsultation = async () => {
    setIsSaving(true);
    try {
      await prescriptionService.create({
        patient: activeConsultation._id,
        appointmentId: activeConsultation.appointmentId,
        diagnosis: consultationData.diagnosis,
        medicines: consultationData.medicines,
        notes: consultationData.notes,
        followUpDate: consultationData.followUpDate
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      fetchQueue(); // Refresh to show completed
    } catch (error) {
      console.error(error);
      alert("Failed to save consultation");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-10 print:m-0 print:p-0 print:space-y-0">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-[200] animate-in slide-in-from-top-5 fade-in duration-300 print:hidden">
          <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-4 max-w-md flex items-start space-x-4">
            <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900">Consultation Saved!</h4>
              <p className="text-xs text-slate-500 mt-1">Patient records have been successfully updated.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard (Hidden during print) */}
      <div className={cn("space-y-6", activeConsultation ? "hidden" : "block print:hidden")}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good Morning, Dr. Emily Chen</h1>
            <p className="text-slate-500 mt-1">Here is your clinical schedule &bull; {currentDate}</p>
          </div>
          <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Clinic Open</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Today's Patients" value="24" icon={Users} trend={8} description="Total queued" />
          <DashboardCard title="Completed" value="9" icon={CalendarCheck} description="Consultations finished" />
          <DashboardCard title="Pending" value="15" icon={Clock} description="Waiting in queue" />
          <DashboardCard title="Follow-Ups" value="4" icon={RotateCw} description="Scheduled reviews" />
        </div>

        {/* Consultation Queue Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Clinical Queue</h2>
              <p className="text-sm text-slate-500">Patients registered by reception awaiting consultation.</p>
            </div>
          </div>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Queue</th>
                  <th className="px-6 py-4 font-semibold">Patient Name</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Primary Reason</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id} className="bg-white border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">{apt.queueNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={`https://i.pravatar.cc/150?u=${apt.patient.patientId}`} alt={apt.patient.fullName} className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{apt.patient.fullName}</span>
                          <span className="text-xs font-mono text-slate-500">{apt.patient.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{apt.appointmentTime}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={apt.symptoms}>{apt.symptoms}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {apt.status !== 'Completed' ? (
                        <Button onClick={() => handleOpenConsultation(apt)} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-sm text-xs h-8 px-3">
                          <Stethoscope size={14} className="mr-1.5" /> Open
                        </Button>
                      ) : (
                        <span className="text-sm font-semibold text-slate-400">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN CONSULTATION WORKSPACE                          */}
      {/* ========================================================= */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col">
          
          {/* Workspace Header (Hidden during print) */}
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm print:hidden">
            <div className="flex items-center space-x-4">
              <div className="bg-red-50 text-red-500 p-2 rounded-lg"><Activity size={20} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Live Consultation Workspace</h2>
                <p className="text-xs font-medium text-slate-500 flex items-center">
                  <span className="font-mono">{activeConsultation.queueNo}</span>
                  <span className="mx-2">&bull;</span>
                  {activeConsultation.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="text-slate-600 bg-white" onClick={() => alert("Drafts not implemented in MVP")} disabled={isSaving}>
                <Save size={16} className="mr-2" /> Save Draft
              </Button>
              <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md" disabled={isSaving} onClick={async () => {
                await handleSaveConsultation();
                setTimeout(() => handleCloseConsultation(), 1000);
              }}>
                <CheckCircle2 size={16} className="mr-2" /> Mark Complete
              </Button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button onClick={handleCloseConsultation} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Workspace Body */}
          <div className="flex flex-1 overflow-hidden print:overflow-visible">
            
            {/* LEFT PANE: Patient Baseline (Hidden during print) */}
            <div className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col overflow-y-auto flex-shrink-0 print:hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Patient Baseline</h3>
                <button onClick={() => setIsEditingPatient(!isEditingPatient)} className="text-[#0ea5e9] hover:text-[#0284c7] text-xs font-medium flex items-center">
                  <Edit2 size={12} className="mr-1" /> {isEditingPatient ? 'Done' : 'Edit'}
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <img src={`https://i.pravatar.cc/150?u=${patientData.patientId}`} alt="Profile" className="w-16 h-16 rounded-xl border border-slate-200 object-cover shadow-sm" />
                  <div>
                    {isEditingPatient ? (
                      <Input value={patientData.fullName} onChange={(e) => setPatientData({...patientData, fullName: e.target.value})} className="h-8 text-sm font-bold w-full" />
                    ) : (
                      <h4 className="text-xl font-bold text-slate-900">{patientData.fullName}</h4>
                    )}
                    <p className="text-sm font-mono text-slate-500 mt-1">{patientData.patientId}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Age</p>
                      {isEditingPatient ? <Input type="number" value={patientData.age} onChange={(e) => setPatientData({...patientData, age: e.target.value})} className="h-8 text-sm" /> : <p className="text-sm font-semibold text-slate-900">{patientData.age} Yrs</p>}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Gender</p>
                      {isEditingPatient ? (
                        <select value={patientData.gender} onChange={(e) => setPatientData({...patientData, gender: e.target.value})} className="h-8 w-full border border-slate-300 rounded text-sm px-2">
                          <option>Male</option><option>Female</option>
                        </select>
                      ) : <p className="text-sm font-semibold text-slate-900">{patientData.gender}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Blood Group</p>
                      {isEditingPatient ? <Input value={patientData.bloodGroup} onChange={(e) => setPatientData({...patientData, bloodGroup: e.target.value})} className="h-8 text-sm" /> : <p className="text-sm font-semibold text-red-600">{patientData.bloodGroup}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Phone</p>
                      {isEditingPatient ? <Input value={patientData.phone} onChange={(e) => setPatientData({...patientData, phone: e.target.value})} className="h-8 text-sm" /> : <p className="text-sm font-semibold text-slate-900">{patientData.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Address</p>
                    {isEditingPatient ? <textarea value={patientData.address} onChange={(e) => setPatientData({...patientData, address: e.target.value})} className="w-full border border-slate-300 rounded text-sm px-2 py-1 min-h-[60px]" /> : <p className="text-sm font-medium text-slate-900">{patientData.address}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-2 flex items-center"><AlertCircle size={14} className="mr-1.5"/> Allergies</p>
                    {isEditingPatient ? <textarea value={patientData.allergies} onChange={(e) => setPatientData({...patientData, allergies: e.target.value})} className="w-full bg-white border border-amber-200 rounded text-sm px-2 py-1" /> : <p className="text-sm font-medium text-amber-900">{patientData.allergies}</p>}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center"><History size={14} className="mr-1.5"/> Past Medical History</p>
                    {isEditingPatient ? <textarea value={patientData.medicalHistory} onChange={(e) => setPatientData({...patientData, medicalHistory: e.target.value})} className="w-full bg-white border border-slate-300 rounded text-sm px-2 py-1 min-h-[60px]" /> : <p className="text-sm font-medium text-slate-900">{patientData.medicalHistory}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Clinical Workflow & Prescription */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden print:w-full print:block">
              
              {/* Doctor Notes & Forms (Hidden during print) */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 bg-slate-50 print:hidden">
                
                {/* Reference Section: History & Reports */}
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Clinical Reference</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <p className="text-sm italic text-slate-500">History not available in MVP</p>
                  </div>
                </div>

                {/* Consultation Form */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center">
                      <Stethoscope size={16} className="mr-2" /> Current Consultation
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Presenting Symptoms</label>
                        <textarea value={consultationData.symptoms} onChange={(e) => setConsultationData({...consultationData, symptoms: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0ea5e9] outline-none min-h-[80px]" placeholder="Patient presents with..."></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Diagnosis</label>
                        <Input value={consultationData.diagnosis} onChange={(e) => setConsultationData({...consultationData, diagnosis: e.target.value})} className="text-sm font-bold text-slate-900" placeholder="E.g., Acute Bronchitis" />
                      </div>
                      
                      {/* Medicine Builder */}
                      <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-900 flex items-center"><Syringe size={16} className="mr-2 text-[#0ea5e9]"/> Prescribe Medicines</label>
                          <Button variant="outline" size="sm" className="h-7 text-xs bg-white" onClick={handleAddMedicine}><Plus size={12} className="mr-1"/> Add Drug</Button>
                        </div>
                        {consultationData.medicines.map((med, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Input value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} placeholder="Medicine Name (e.g., Azithromycin 500mg)" className="flex-1 bg-white" />
                            <Input value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} placeholder="Dosage (e.g., 1-0-1 for 3 days)" className="flex-1 bg-white" />
                            {consultationData.medicines.length > 1 && (
                              <button onClick={() => handleRemoveMedicine(idx)} className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors"><X size={18} /></button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Doctor Notes & Precautions</label>
                        <textarea value={consultationData.notes} onChange={(e) => setConsultationData({...consultationData, notes: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0ea5e9] outline-none min-h-[80px]" placeholder="Rest, drink warm water..."></textarea>
                      </div>

                      <div>
                        <Input label="Follow-Up Date" type="date" value={consultationData.followUpDate} onChange={(e) => setConsultationData({...consultationData, followUpDate: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* LIVE PRESCRIPTION PREVIEW (UI Only, not printed directly) */}
              <div className="w-full md:w-[450px] lg:w-[500px] border-l border-slate-200 bg-slate-200/50 p-6 overflow-y-auto flex flex-col items-center">
                
                <div className="w-full flex justify-end mb-4">
                  <Button onClick={handlePrintPrescription} className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm">
                    <Printer size={16} className="mr-2" /> Print Prescription
                  </Button>
                </div>

                {/* The Visible Preview Page */}
                <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-xl border border-slate-200">
                  
                  {/* Invisible Actual Print Component */}
                  <PrescriptionPrint 
                    patient={patientData}
                    doctor={{ name: user?.name, department: user?.department || "General Medicine", regNo: "MAH-2015-8942" }}
                    diagnosis={consultationData.diagnosis}
                    medicines={consultationData.medicines}
                    notes={consultationData.notes || consultationData.symptoms}
                    currentDate={currentDate}
                  />
                  
                  {/* Prescription Header */}
                  <div className="border-b-2 border-[#0ea5e9] p-8 flex justify-between items-center bg-blue-50/30">
                    <div>
                      <h1 className="text-3xl font-bold text-[#0ea5e9] tracking-tight">MediCore Hospital</h1>
                      <p className="text-sm text-slate-500 mt-1">Excellence in Healthcare</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                      <p className="text-sm text-slate-600 font-medium">{user?.department || "General Medicine"}</p>
                      <p className="text-xs text-slate-500">Reg No: MAH-2015-8942</p>
                    </div>
                  </div>

                  {/* Patient Info Block */}
                  <div className="p-8 border-b border-slate-200">
                    <div className="flex justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-900">Date: <span className="font-normal text-slate-700">{currentDate}</span></p>
                      <p className="text-sm font-semibold text-slate-900">Patient ID: <span className="font-mono font-normal text-slate-700">{patientData.patientId}</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="grid grid-cols-2 gap-y-2">
                        <p className="text-sm"><span className="font-semibold text-slate-600">Patient Name:</span> <span className="font-bold text-slate-900">{patientData.fullName}</span></p>
                        <p className="text-sm"><span className="font-semibold text-slate-600">Age / Gender:</span> {patientData.age} Yrs / {patientData.gender}</p>
                        <p className="text-sm"><span className="font-semibold text-slate-600">Blood Group:</span> {patientData.bloodGroup}</p>
                        <p className="text-sm"><span className="font-semibold text-slate-600">Mobile:</span> {patientData.phone}</p>
                        <p className="text-sm col-span-2"><span className="font-semibold text-slate-600">Allergies:</span> {patientData.allergies}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Data */}
                  <div className="p-8 space-y-8 min-h-[400px]">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center">
                        <span className="text-[#0ea5e9] text-xl mr-2 font-serif italic">Rx</span>
                        Diagnosis
                      </h3>
                      <p className="text-sm font-semibold text-slate-800 border-l-2 border-[#0ea5e9] pl-3">{consultationData.diagnosis || 'Pending Diagnosis...'}</p>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Medicines Prescribed</h3>
                      <ul className="space-y-4">
                        {consultationData.medicines.map((med, i) => (
                          <li key={i} className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{i + 1}. {med.name || '---'}</p>
                              <p className="text-xs font-medium text-slate-600 mt-0.5">{med.dosage || '---'}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(consultationData.notes || consultationData.symptoms) && (
                      <div>
                        <h3 className="text-base font-bold text-slate-900 mb-2 border-b border-slate-200 pb-2">Clinical Notes & Precautions</h3>
                        <p className="text-sm text-slate-700 leading-relaxed">{consultationData.notes || consultationData.symptoms}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer & Signature */}
                  <div className="p-8 mt-auto border-t border-slate-200">
                    <div className="flex justify-between items-end">
                      <div>
                        {consultationData.followUpDate && (
                          <p className="text-sm font-semibold text-slate-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                            Follow-Up Date: <span className="text-amber-700">{consultationData.followUpDate}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="w-40 h-16 border-b border-dashed border-slate-400 mb-2"></div>
                        <p className="text-sm font-bold text-slate-900">Doctor's Signature</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
