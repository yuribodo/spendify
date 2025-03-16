import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { DeleteExpenseUseCase } from '@/use-cases/expenses/delete-expense';
import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let sut: DeleteExpenseUseCase;

describe('Delete Expense Use Case', () => {
    beforeEach(() => {
        expensesRepository = new InMemoryExpensesRepository();
        sut = new DeleteExpenseUseCase(expensesRepository);
    });

    it('should exclude the expense if it exists and belongs to the user', async () => {
        const expense = {
            id: 1,
            description: 'Despesa de teste',
            date: new Date('2025-03-01'),
            value: new Prisma.Decimal(100),
            categoryId: 1,
            payment_method: 'cartão de crédito',
            userId: 'user-123'
        };

        expensesRepository.items.push(expense);

        await sut.execute({ expenseId: expense.id, userId: expense.userId });

        const foundExpense = await expensesRepository.findById({ id: expense.id, userId: null });
        expect(foundExpense).toBeNull();
    });

    it('should make a mistake if the expense does not exist', async () => {
        await expect(
            sut.execute({ expenseId: 999, userId: 'user-123' })
        ).rejects.toThrow('Expense not found');
    });

    it('should throw an error if the user is not allowed to delete the expense', async () => {
        const expense = {
            id: 1,
            description: 'Despesa de teste',
            date: new Date('2025-03-01'),
            value: new Prisma.Decimal(100),
            categoryId: 1,
            payment_method: 'cartão de crédito',
            userId: 'user-123'
        };


        expensesRepository.items.push(expense);

        await expect(
            sut.execute({ expenseId: expense.id, userId: 'user-999' })
        ).rejects.toThrow('Not authorized to delete this expense');
    });
});
