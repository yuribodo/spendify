'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileEdit,
  Info,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { memo, useCallback, useState } from 'react';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

const TransactionRow = memo(({ transaction }: { transaction: Transaction }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span>{transaction.icon}</span>
          </div>
          <div>
            <div className="text-sm font-medium">{transaction.title}</div>
            {transaction.description && (
              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                {transaction.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
          {transaction.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {transaction.amount > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-success mr-1" />
          ) : (
            <ArrowDownLeft className="w-4 h-4 text-destructive mr-1" />
          )}
          <span className={transaction.amount > 0 ? 'text-success' : 'text-destructive'}>
            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="outline" className={`${getStatusColor(transaction.status)}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Badge>
      </td>
      <td className="px-6 py-4 text-right text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Info className="mr-2 h-4 w-4" />
              <span>Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <FileEdit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center text-destructive cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
});

TransactionRow.displayName = 'TransactionRow';

const TransactionTable = () => {
  //TODO: this should come from an API
  const transactions: Transaction[] = [
    {
      id: 1,
      title: 'Grocery Shopping',
      amount: -120.50,
      date: '2023-09-15',
      category: 'Food',
      icon: '🛒',
      status: 'completed',
      description: 'Weekly grocery shopping at Whole Foods'
    },
    {
      id: 2,
      title: 'Salary',
      amount: 2500.00,
      date: '2023-09-01',
      category: 'Income',
      icon: '💰',
      status: 'completed',
      description: 'Monthly salary payment'
    },
    {
      id: 3,
      title: 'Electric Bill',
      amount: -75.20,
      date: '2023-09-10',
      category: 'Utilities',
      icon: '💡',
      status: 'completed',
      description: 'Electricity bill for September'
    },
    {
      id: 4,
      title: 'Netflix Subscription',
      amount: -15.99,
      date: '2023-09-05',
      category: 'Entertainment',
      icon: '📺',
      status: 'completed',
      description: 'Monthly Netflix subscription'
    },
    {
      id: 5,
      title: 'Dinner at Restaurant',
      amount: -45.75,
      date: '2023-09-14',
      category: 'Food',
      icon: '🍽️',
      status: 'pending',
      description: 'Dinner with friends at an Italian restaurant'
    },
    {
      id: 6,
      title: 'Gym Membership',
      amount: -50.00,
      date: '2023-09-03',
      category: 'Health',
      icon: '🏋️',
      status: 'completed',
      description: 'Monthly gym membership fee'
    },
    {
      id: 7,
      title: 'Freelance Payment',
      amount: 600.00,
      date: '2023-09-20',
      category: 'Income',
      icon: '💻',
      status: 'completed',
      description: 'Payment for freelance web development work'
    },
    {
      id: 8,
      title: 'Amazon Purchase',
      amount: -89.99,
      date: '2023-09-12',
      category: 'Shopping',
      icon: '📦',
      status: 'completed',
      description: 'Bought new headphones from Amazon'
    },
    {
      id: 9,
      title: 'Fuel',
      amount: -40.00,
      date: '2023-09-08',
      category: 'Transport',
      icon: '⛽',
      status: 'completed',
      description: 'Filled up car with gas'
    },
    {
      id: 10,
      title: 'Concert Ticket',
      amount: -75.00,
      date: '2023-09-22',
      category: 'Entertainment',
      icon: '🎶',
      status: 'pending',
      description: 'Ticket for a live concert event'
    }
  ];

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 25;

  const handleNextPage = useCallback(() => {
    if ((page * itemsPerPage) < totalItems) {
      setPage(page + 1);
    }
  }, [page, totalItems]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-background border-t border-border px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((page - 1) * itemsPerPage + 1, totalItems)} to {Math.min(page * itemsPerPage, totalItems)} of {totalItems} transactions
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * itemsPerPage >= totalItems}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;