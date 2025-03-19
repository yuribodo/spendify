import React from 'react';
import { Header } from '@/components/layout/Header';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

export default function SpendifyDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-8 animate-slide-in-up">
        <FinancialOverview />
        <CashFlowChart />
        <RecentTransactions />
      </main>
    </div>
  );
}