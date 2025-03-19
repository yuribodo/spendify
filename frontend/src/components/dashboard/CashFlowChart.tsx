import React from 'react';
import { SectionCard } from '../ui-custom/SectionCard';

export const CashFlowChart: React.FC = () => {
  return (
    <SectionCard title="Monthly Cash Flow">
      <div className="flex items-center justify-center h-40 bg-secondary rounded-lg">
        <p className="text-muted-foreground">Chart will be displayed here</p>
      </div>
    </SectionCard>
  );
};