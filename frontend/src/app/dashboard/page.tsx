import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

export default function SpendifyDashboard() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <main className="container mx-auto px-4 py-6 space-y-8 animate-slide-in-up">
        <FinancialOverview />
        <CashFlowChart />
        <RecentTransactions />
      </main>
    </div>
  );
}