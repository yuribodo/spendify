import React from 'react';
import { MetricCard } from '../ui-custom/MetricCard';
import { DollarSign, TrendingUp, CreditCard, Percent } from 'lucide-react';

export const FinancialOverview: React.FC = () => {
  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24 animate-fade-in">
      <h2 className="heading-lg mb-1">Financial Overview</h2>
      <p className="text-muted-foreground mb-6">Track your spending and manage your finances</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Balance" 
          value="$12,560.80" 
          percentChange={8.2} 
          icon={<DollarSign className="text-primary" size={20} />} 
        />
        <MetricCard 
          title="Monthly Income" 
          value="$4,850.00" 
          percentChange={12.3} 
          icon={<TrendingUp className="text-accent" size={20} />} 
        />
        <MetricCard 
          title="Monthly Expenses" 
          value="$2,150.40" 
          percentChange={3.1} 
          icon={<CreditCard className="text-destructive" size={20} />} 
        />
        <MetricCard 
          title="Savings Rate" 
          value="35%" 
          percentChange={5.4} 
          icon={<Percent className="text-primary" size={20} />} 
        />
      </div>
    </div>
  );
};