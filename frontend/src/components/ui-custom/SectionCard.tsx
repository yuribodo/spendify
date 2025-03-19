import React, { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, action }) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-subtle border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-sm">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
};