import React from 'react';
import { cn } from '../utils/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-[#0ea5e9] text-white hover:bg-[#0284c7] shadow-sm hover:shadow-md",
    outline: "border border-[#e2e8f0] bg-white hover:bg-slate-50 text-[#0f172a]",
    ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-lg px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
