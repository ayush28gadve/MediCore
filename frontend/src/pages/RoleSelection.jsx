import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Stethoscope, UserCog, HeartPulse } from 'lucide-react';
import { RoleCard } from '../components/RoleCard';

export function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
            <HeartPulse size={32} className="text-[#0ea5e9]" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Welcome to <span className="text-[#0ea5e9]">MediCore</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Select your portal to access the centralized hospital management system.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RoleCard
            icon={Shield}
            title="Admin"
            description="Manage hospital staff, departments, patient records, and system settings."
            onClick={() => handleRoleSelect('admin')}
          />
          <RoleCard
            icon={Stethoscope}
            title="Doctor"
            description="View your appointments, access patient medical histories, and write prescriptions."
            onClick={() => handleRoleSelect('doctor')}
          />
          <RoleCard
            icon={UserCog}
            title="Reception"
            description="Schedule patient appointments, manage billing, and handle front-desk operations."
            onClick={() => handleRoleSelect('reception')}
          />
        </div>
      </div>
    </div>
  );
}
