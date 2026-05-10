import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../utils/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileText
} from 'lucide-react';

const roleMenus = {
  admin: [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', path: '/admin/doctors', icon: Users },
    { name: 'Patients', path: '/admin/patients', icon: Activity },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ],
  doctor: [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Patients', path: '/doctor/patients', icon: Users },
    { name: 'Reports', path: '/doctor/reports', icon: FileText },
  ],
  reception: [
    { name: 'Dashboard', path: '/reception/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/reception/appointments', icon: Calendar },
    { name: 'Patients', path: '/reception/patients', icon: Users },
  ]
};

export function Sidebar({ role = 'admin' }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const menuItems = roleMenus[role] || roleMenus.admin;

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        {!collapsed && (
          <span className="text-xl font-bold text-[#0ea5e9]">MediCore</span>
        )}
        {collapsed && (
          <div className="mx-auto text-xl font-bold text-[#0ea5e9]">M</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-5 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-slate-900 shadow-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-blue-50 text-[#0ea5e9] font-medium" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0 transition-colors", 
                    isActive ? "text-[#0ea5e9]" : "text-slate-400 group-hover:text-slate-600",
                    collapsed ? "mx-auto" : "mr-3"
                  )} 
                />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/"
          className={cn(
            "flex items-center px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors group",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} className={cn("flex-shrink-0", !collapsed && "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </NavLink>
      </div>
    </div>
  );
}
