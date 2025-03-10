import { ReactNode } from 'react';
import { SectionTitle } from './SectionTitle';
import { theme } from '@/lib/theme';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`
      /* Layout */
      relative 
      /* Spacing */
      mb-12
      /* Custom classes */
      ${className}
    `}>
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-8">
        {children}
      </div>
    </section>
  );
} 