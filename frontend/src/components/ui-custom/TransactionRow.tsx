import React from 'react';
import type { Transaction } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-4">
        <span className="bg-secondary text-muted-foreground p-2 rounded-md">
          {transaction.icon}
        </span>
        <div>
          <h3 className="font-medium">{transaction.title}</h3>
          <p className="text-muted-foreground text-sm">
            {transaction.category} • {transaction.date}
          </p>
        </div>
      </div>
      <span className={`font-medium ${transaction.amount >= 0 ? 'text-accent' : 'text-destructive'}`}>
        {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </span>
    </div>
  );
};