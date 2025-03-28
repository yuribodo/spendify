import TransactionsContent from '@/components/transactions/TransactionContent';
import TransactionsHeader from '@/components/transactions/TransactionHeader';
import TransactionsSearchWrapper from '@/components/transactions/TransactionsSearchWrapper';
import LoadingSpinner from '@/components/ui-custom/LoadingSpinner';
import { Suspense } from 'react';

export default function Transactions() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <main className="container mx-auto px-4 py-6 space-y-8">
        <TransactionsHeader />
        <Suspense fallback={<LoadingSpinner />}>
          <TransactionsSearchWrapper />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <TransactionsContent />
        </Suspense>
      </main>
    </div>
  );
}