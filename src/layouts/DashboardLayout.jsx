import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Bell, Search, UserCircle } from 'lucide-react';

export function DashboardLayout({ role, children }) {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center text-slate-500 bg-slate-100 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-[#0ea5e9] focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none pl-2 w-full text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              <UserCircle size={24} className="text-slate-400" />
              <span className="hidden sm:inline-block capitalize">{role} User</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
