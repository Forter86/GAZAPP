import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  asymmetry?: boolean;
}

export const Card = ({ children, className = '', asymmetry = false }: CardProps) => {
  return (
    <div className={`
      bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
      ${asymmetry ? 'rounded-tr-[40px] rounded-bl-[40px]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
