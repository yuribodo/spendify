'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDownUp, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';


const TransactionFilters = dynamic(() => import('./TransactionFilters'), {
  loading: () => <div className="h-16 w-full bg-muted/20 animate-pulse rounded-md"></div>,
  ssr: false
});

const TransactionsSearchWrapper = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            placeholder="Search transactions..."
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
        </div>
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <ArrowDownUp size={16} />
          <span>Sort</span>
        </Button>
      </div>

      {isFiltersVisible && <TransactionFilters />}
    </div>
  );
};

export default TransactionsSearchWrapper;