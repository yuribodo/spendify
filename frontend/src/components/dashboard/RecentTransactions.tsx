import { Plus } from 'lucide-react';
import React from 'react';
import type { Transaction } from '@/types';
import { SectionCard } from '../ui-custom/SectionCard';
import { TransactionRow } from '../ui-custom/TransactionRow';

export const RecentTransactions: React.FC = () => {
    const transactions: Transaction[] = [
        {
            id: 1,
            title: 'Grocery Shopping',
            category: 'Food',
            date: 'over 1 year ago',
            amount: -120.50,
            icon: '🛒',
        },
        {
            id: 2,
            title: 'Salary Deposit',
            category: 'Income',
            date: 'over 1 year ago',
            amount: 3500.00,
            icon: '💰',
        },
        {
            id: 3,
            title: 'Netflix Subscription',
            category: 'Entertainment',
            date: 'over 1 year ago',
            amount: -14.99,
            icon: '🎬',
        },
        {
            id: 4,
            title: 'Restaurant',
            category: 'Food',
            date: 'over 1 year ago',
            amount: -45.80,
            icon: '🍽️',
        },
        {
            id: 5,
            title: 'Freelance Work',
            category: 'Income',
            date: 'over 1 year ago',
            amount: 350.00,
            icon: '💻',
        },
    ];

    const actionButton = (
        <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Add Transaction
        </button>
    );

    return (
        <SectionCard title="Recent Transactions" action={actionButton}>
            <div className="space-y-4">
                {transactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
            </div>
        </SectionCard>
    );
};