import React from 'react';
import { cn } from '../utils/utils';
import { Button } from './Button';

export function RoleCard({ icon: Icon, title, description, onClick, className }) {
  return (
    <div 
      className={cn(
        "group relative flex flex-col items-center p-8 bg-white rounded-2xl border border-slate-200 cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(14,165,233,0.15)] hover:border-[#0ea5e9]",
        className
      )}
      onClick={onClick}
    >
      <div className="mb-6 p-4 rounded-full bg-slate-50 text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors duration-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
        {description}
      </p>
      <Button variant="outline" className="w-full group-hover:!bg-[#0ea5e9] group-hover:!text-white group-hover:!border-[#0ea5e9] transition-all duration-300">
        Continue as {title}
      </Button>
    </div>
  );
}
