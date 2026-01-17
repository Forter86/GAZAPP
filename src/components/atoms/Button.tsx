import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary' 
}: ButtonProps) => {
  const baseStyles = "px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 text-center cursor-pointer";
  
  const variants = {
    primary: "bg-[#4A90E2] text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white text-[#383333] border border-[#2F54C6]",
    outline: "border-2 border-[#4A90E2] text-[#4A90E2] bg-transparent"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
