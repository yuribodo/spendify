'use client'

import { Button } from '@/components/ui/button';
import { Download, Filter, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';


const AddTransactionModal = dynamic(
  () => import('@/components/transactions/AddTransactionModal'),
  { ssr: false }
);

const TransactionsHeader = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  return (
    <>
      <div className="pt-32 pb-6 md:pt-40 md:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="heading-lg mb-1">Transactions</h1>
            <p className="text-muted-foreground">View and manage all your financial transactions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              <span>Filters</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 btn-shine"
            >
              <Plus size={16} />
              <span>Add New</span>
            </Button>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </>
  );
};

export default TransactionsHeader;