import React from 'react';
import { cn } from '../lib/utils';

export function DashboardCard({ title, value, icon: Icon, description, trend, className }) {
  return (
    <div className={cn("p-6 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {Icon && (
          <div className="p-2 bg-blue-50 text-[#0ea5e9] rounded-lg">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        <div className="flex items-center mt-2 text-sm">
          {trend && (
            <span className={cn(
              "font-medium mr-2",
              trend > 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          <span className="text-slate-500">{description}</span>
        </div>
      </div>
    </div>
  );
}
