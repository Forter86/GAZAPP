import type { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export const Heading = ({ children, level = 1, className = '' }: HeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  
  const styles: Record<number, string> = {
    1: "text-4xl md:text-5xl font-black tracking-tight leading-tight",
    2: "text-2xl md:text-3xl font-extrabold tracking-tight",
    3: "text-xl font-bold"
  };

  return (
    <Tag className={`${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
};
