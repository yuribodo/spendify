import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MetricCardProps } from '../../types';

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentChange, icon }) => {
  const isPositive = percentChange >= 0;
  
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-subtle border border-border card-hover">
      <div className="flex justify-between items-start mb-4">
        <span className="text-muted-foreground">{title}</span>
        <span className="bg-secondary text-secondary-foreground p-2 rounded-full">
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className={`flex items-center text-sm ${isPositive ? 'text-accent' : 'text-destructive'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {isPositive ? '+' : ''}{percentChange}%
        </span>
        <span className="text-muted-foreground text-sm">vs last month</span>
      </div>
    </div>
  );
};