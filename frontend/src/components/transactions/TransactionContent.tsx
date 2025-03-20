import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingTable from '../ui-custom/LoadingTable';

const TransactionTable = dynamic(() => import('./TransactionTable'), {
  loading: () => <LoadingTable />,
});

const TransactionsContent = () => {
  return (
    <Suspense fallback={<LoadingTable />}>
      <TransactionTable />
    </Suspense>
  );
};

export default TransactionsContent;