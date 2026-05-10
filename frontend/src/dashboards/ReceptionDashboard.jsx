import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  CalendarClock, 
  UserCheck, 
  Stethoscope, 
  Camera,
  Save,
  RefreshCw,
  CheckCircle2,
  X,
  UploadCloud,
  Edit2,
  Eye,
  Search,
  UserPlus,
  Clock,
  Pill,
  Activity,
  Calendar
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { cn } from '../utils/utils';
import { patientService } from '../services/patientService';
import { authService } from '../services/authService';

// Removed MOCK_PATIENTS

export function ReceptionDashboard() {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Workflow State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [activePatient, setActivePatient] = useState(null); // Full patient object for profile view
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // API Data State
  const [allPatients, setAllPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: 'New', // Handled by backend now
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    symptoms: '',
    medicalHistory: '',
    allergies: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  // Handle click outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [patientsData, doctorsData] = await Promise.all([
        patientService.getAll(),
        authService.getDoctors()
      ]);
      setAllPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = allPatients.filter(p => 
        p.fullName?.toLowerCase().includes(query.toLowerCase()) || 
        p.patientId?.toLowerCase().includes(query.toLowerCase()) ||
        p.mobile?.includes(query)
      );
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setIsExistingPatient(true);
    setActivePatient(patient);
    setFormData({
      ...formData,
      patientId: patient.patientId,
      symptoms: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: ''
    });
    setSearchQuery('');
    setShowDropdown(false);
    setPhotoPreview(`https://i.pravatar.cc/150?u=${patient.patientId}`);
  };

  const handleNewPatient = () => {
    setIsExistingPatient(false);
    setActivePatient(null);
    setSearchQuery('');
    setShowDropdown(false);
    handleReset();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access camera. Please allow permissions in your browser.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setPhotoPreview(dataUrl);
      stopCamera();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.doctorId) {
        alert("Please assign a doctor!");
        return;
      }
      
      const payload = {
        ...formData,
        mobile: formData.phone // Mapping to match backend
      };

      await patientService.register(payload);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000);
      handleReset();
      fetchInitialData(); // Refresh patient list
    } catch (error) {
      console.error("Failed to register patient", error);
      alert(error.response?.data?.message || "Failed to register patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsExistingPatient(false);
    setActivePatient(null);
    setFormData({
      patientId: 'New',
      fullName: '',
      age: '',
      gender: '',
      phone: '',
      address: '',
      bloodGroup: '',
      emergencyContact: '',
      symptoms: '',
      medicalHistory: '',
      allergies: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: ''
    });
    setPhotoPreview(null);
  };

  // Mock Data for Table
  const recentPatients = [
    { id: 'MC-10452', name: 'Sarah Jenkins', doctor: 'Dr. Emily Chen', time: '10:30 AM', status: 'Waiting', img: 'https://i.pravatar.cc/150?u=1' },
    { id: 'MC-10453', name: 'Robert Fox', doctor: 'Dr. Michael Smith', time: '11:00 AM', status: 'In Consultation', img: 'https://i.pravatar.cc/150?u=2' },
    { id: 'MC-004', name: 'Priya Deshmukh', doctor: 'Dr. Sarah Wilson', time: '11:15 AM', status: 'Waiting', img: 'https://i.pravatar.cc/150?u=MC-004' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="space-y-6 relative pb-10">
      
      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-4 max-w-md flex items-start space-x-4">
            <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900">Appointment Created Successfully</h4>
              <p className="text-xs text-slate-500 mt-1">Confirmation Sent To Patient Mobile Number</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Capture Patient Photo</h3>
                <p className="text-sm text-slate-500">Please align face inside the frame.</p>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 bg-slate-100 flex justify-center items-center">
              <div className="relative w-full max-w-sm aspect-square bg-black rounded-xl overflow-hidden shadow-inner border border-slate-300">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                <div className="absolute inset-0 border-4 border-white/20 border-dashed m-8 rounded-full pointer-events-none"></div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end space-x-3">
              <Button variant="ghost" onClick={stopCamera}>Cancel</Button>
              <Button onClick={capturePhoto} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md">
                <Camera size={16} className="mr-2" /> Capture Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good Morning, Receptionist</h1>
          <p className="text-slate-500 mt-1">{currentDate}</p>
        </div>
        <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700">System Online</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Patients Today" value="142" icon={Users} trend={12.5} description="vs yesterday" className="bg-white/80 backdrop-blur-md" />
        <DashboardCard title="Completed Consultations" value="89" icon={UserCheck} description="62% completion rate" className="bg-white/80 backdrop-blur-md" />
        <DashboardCard title="Remaining Patients" value="53" icon={CalendarClock} description="Currently in queue/lobby" className="bg-white/80 backdrop-blur-md" />
        <DashboardCard title="Available Doctors" value="14" icon={Stethoscope} description="Out of 18 scheduled" className="bg-white/80 backdrop-blur-md" />
      </div>

      {/* Main Registration / Reappointment Workflow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible relative z-10">
        
        {/* Patient Workflow Search Header */}
        <div className="border-b border-slate-200 px-6 py-5 bg-slate-50/50 rounded-t-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Patient Management</h2>
            <p className="text-sm text-slate-500">Search existing records to create reappointment, or register new.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            
            <div className="relative w-full sm:w-96" ref={dropdownRef}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Search Patient ID, Name, Mobile..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all"
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Records</div>
                  {searchResults.map(p => (
                    <div key={p.patientId} onClick={() => handlePatientSelect(p)} className="px-4 py-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer last:border-0 transition-colors flex justify-between items-center group">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-[#0ea5e9] transition-colors">{p.fullName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{p.patientId} &bull; {p.mobile}</p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-slate-400 block">Registered</span>
                        <span className="font-medium text-slate-700">{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showDropdown && searchQuery.length > 0 && searchResults.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-4 text-center">
                  <p className="text-sm text-slate-500">No patient found. Please register new.</p>
                </div>
              )}
            </div>
            
            <Button onClick={handleNewPatient} className={cn(
              "w-full sm:w-auto flex-shrink-0 transition-colors",
              !isExistingPatient ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            )}>
              <UserPlus size={16} className="mr-2" /> New Registration
            </Button>
          </div>
        </div>

        {/* Dynamic Form Area */}
        <form onSubmit={handleSaveAppointment} className="p-0">
          
          {/* ========================================================= */}
          {/* SCENARIO A: EXISTING PATIENT REAPPOINTMENT WORKFLOW       */}
          {/* ========================================================= */}
          {isExistingPatient && activePatient && (
            <div className="bg-slate-50/30">
              
              {/* Profile Overview Card */}
              <div className="p-6 border-b border-slate-200 bg-white">
                <h3 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4 flex items-center">
                  <UserCheck size={16} className="mr-2" /> Complete Patient Profile
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img src={photoPreview} alt="Profile" className="w-24 h-24 rounded-2xl border border-slate-200 object-cover shadow-sm bg-slate-50" />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Patient Name</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{activePatient.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Patient ID</p>
                      <p className="text-sm font-mono text-slate-900 mt-0.5">{activePatient.patientId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Age / Gender</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{activePatient.age} yrs, {activePatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Blood Group</p>
                      <p className="text-sm font-medium text-red-600 mt-0.5">{activePatient.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Mobile Number</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{activePatient.phone}</p>
                    </div>
                    <div className="sm:col-span-3">
                      <p className="text-xs text-slate-500 font-medium">Address</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5 truncate">{activePatient.address}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-500 font-medium">Medical History</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{activePatient.medicalHistory || "None"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-500 font-medium">Known Allergies</p>
                      <p className="text-sm font-medium text-amber-600 mt-0.5">{activePatient.allergies || "None"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit History Section (Placeholder for MVP) */}
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4 flex items-center">
                  <Clock size={16} className="mr-2" /> Patient Visit History
                </h3>
                <div className="text-sm text-slate-500 italic">
                  History integration pending (Fetch prescriptions endpoint)...
                </div>
              </div>

              {/* Reappointment Creation Form */}
              <div className="p-6 bg-white">
                <h3 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4 flex items-center">
                  <CalendarClock size={16} className="mr-2" /> Create Reappointment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-5 rounded-xl border border-blue-100">
                  <div className="md:col-span-2">
                    <Input label="Current Symptoms / Reason for Visit" name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Fever, follow-up, general checkup..." required />
                  </div>
                  <div className="w-full space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Assign Doctor</label>
                    <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" required>
                      <option value="">Select Doctor</option>
                      {doctors.map(d => (
                        <option key={d._id} value={d._id}>{d.name} ({d.department || 'General'})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Date" type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} required />
                    <Input label="Time" type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENARIO B: NEW PATIENT FULL REGISTRATION FORM            */}
          {/* ========================================================= */}
          {!isExistingPatient && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Photo Upload */}
                <div className="lg:col-span-3 flex flex-col items-center">
                  <div className="w-full aspect-square max-w-[240px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 relative overflow-hidden group transition-all hover:border-[#0ea5e9] hover:bg-blue-50/50 flex flex-col items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-slate-400 group-hover:text-[#0ea5e9] transition-colors">
                          <Camera size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Patient Photo</p>
                        <p className="text-xs text-slate-400 mt-1">Capture or upload</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4 w-full max-w-[240px]">
                    <Button type="button" variant="outline" className="w-full text-slate-700 hover:text-[#0ea5e9] hover:border-[#0ea5e9] hover:bg-blue-50 shadow-sm" onClick={startCamera}>
                      <Camera size={16} className="mr-2" /> Capture From Camera
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-slate-500 hover:text-slate-700" onClick={() => document.querySelector('input[type="file"]').click()}>
                      <UploadCloud size={16} className="mr-2" /> Upload From Device
                    </Button>
                  </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Patient Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center">
                      Patient Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-3">
                        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" required />
                      </div>
                      <Input label="Patient ID" name="patientId" value={formData.patientId} disabled className="bg-slate-50 font-mono text-slate-500" />
                      <Input label="Age" type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="34" required />
                      
                      <div className="w-full space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-colors" required>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" required />
                      <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} placeholder="O+" />
                      <Input label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Jane Doe (987...)" />
                      <div className="md:col-span-3">
                        <div className="w-full space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Address</label>
                          <textarea name="address" value={formData.address} onChange={handleInputChange} className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] min-h-[80px] transition-colors" placeholder="123 Medical Park Drive..."></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 mt-4 flex items-center">
                      Medical Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input label="Current Chief Complaints / Symptoms" name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Fever, cough, headache..." required />
                      </div>
                      <Input label="Past Medical History" name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} placeholder="Diabetes, Hypertension..." />
                      <Input label="Allergies" name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="Penicillin, Peanuts..." />
                    </div>
                  </div>

                  {/* Appointment Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 mt-4">Appointment Setup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="w-full space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Assign Doctor</label>
                        <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-colors" required>
                          <option value="">Select Doctor</option>
                          {doctors.map(d => (
                            <option key={d._id} value={d._id}>{d.name} ({d.department || 'General'})</option>
                          ))}
                        </select>
                      </div>
                      <Input label="Date" type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} required />
                      <Input label="Time" type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleInputChange} required />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Action Buttons (Shared by both workflows) */}
          <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={handleReset} className="w-full sm:w-auto text-slate-600">
              <RefreshCw size={16} className="mr-2" /> {isExistingPatient ? "Clear Profile" : "Reset Form"}
            </Button>
            <Button type="submit" className="w-full sm:w-auto bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-md hover:shadow-lg transition-all px-8" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <RefreshCw size={16} className="mr-2 animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save size={16} className="mr-2" /> {isExistingPatient ? "Create Reappointment" : "Register & Create Appointment"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Patient Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8 relative z-0">
        <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Today's Registrations</h2>
            <p className="text-sm text-slate-500">Recently registered patients and their statuses.</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50">View All Records</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Assigned Doctor</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPatients.slice(0, 10).map((patient, idx) => (
                <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={`https://i.pravatar.cc/150?u=${patient.patientId}`} alt={patient.fullName} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                      <span className="font-medium text-slate-900">{patient.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">{patient.patientId}</td>
                  <td className="px-6 py-4 text-slate-700">{patient.assignedDoctor?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-700">{new Date(patient.createdAt).toLocaleTimeString()}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}>
                      Registered
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#0ea5e9] rounded-md hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-[#0ea5e9] rounded-md hover:bg-blue-50 transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
