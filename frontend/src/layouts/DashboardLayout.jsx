import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Bell, Search, UserCircle, Users, Calendar, FileText, Activity } from 'lucide-react';

export function DashboardLayout({ role, children }) {
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowGlobalSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setGlobalSearch(val);
    if (val.trim().length > 0) {
      setShowGlobalSearch(true);
    } else {
      setShowGlobalSearch(false);
    }
  };

  // Mock global results
  const mockGlobalResults = [
    { type: 'Patient', title: 'Rahul Patil', subtitle: 'ID: MC-001', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'Appointment', title: 'Dr. Emily Chen', subtitle: 'Tomorrow, 10:30 AM', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'Report', title: 'CBC Blood Test', subtitle: 'Rahul Patil - May 5, 2026', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    { type: 'Doctor', title: 'Dr. Amit Sharma', subtitle: 'Cardiology Dept', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">


        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 relative z-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
