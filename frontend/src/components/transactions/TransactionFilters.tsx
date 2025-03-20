'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TransactionFilters = () => {
  const [date, setDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>('All');

  const categories = [
    'All', 'Food', 'Transportation', 'Shopping', 
    'Entertainment', 'Housing', 'Health', 'Income', 'Other'
  ];

  const statuses = ['All', 'Completed', 'Pending', 'Failed'];

  const amountRanges = [
    'All', '< $50', '$50 - $100', '$100 - $500', 
    '$500 - $1000', '> $1000'
  ];

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      const newCategories = selectedCategories.includes('All')
        ? [category]
        : selectedCategories.includes(category)
          ? selectedCategories.filter(c => c !== category)
          : [...selectedCategories, category];
      
      setSelectedCategories(newCategories.length ? newCategories : ['All']);
    }
  };

  const resetFilters = () => {
    setDate(undefined);
    setSelectedCategories(['All']);
    setSelectedStatus('All');
    setSelectedAmountRange('All');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
      <div>
        <h3 className="text-sm font-medium mb-2">Date Range</h3>
        <div className="flex flex-col space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {date && (
            <Button 
              variant="ghost" 
              size="sm"
              className="w-fit flex items-center" 
              onClick={() => setDate(undefined)}
            >
              <X className="h-3 w-3 mr-1" />
              Clear date
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Amount</h3>
        <div className="flex flex-wrap gap-2">
          {amountRanges.map((range) => (
            <Button
              key={range}
              variant={selectedAmountRange === range ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedAmountRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="md:col-span-4 flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
        <Button>Apply Filters</Button>
      </div>
    </div>
  );
};

export default TransactionFilters;