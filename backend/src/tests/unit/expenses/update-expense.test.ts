import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { UpdateExpenseUseCase, UpdateExpenseUseCaseRequest } from '@/use-cases/expenses/update-expense';
import { beforeEach, describe, expect, it } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let sut: UpdateExpenseUseCase;

describe('Update Expense Use Case', () => {
    beforeEach(() => {
        expensesRepository = new InMemoryExpensesRepository();
        sut = new UpdateExpenseUseCase(expensesRepository);
    });

    it('should be able to update an expense', async () => {
        const expense = await expensesRepository.create({
            description: 'Original Description',
            date: new Date('2025-03-01'),
            value: 50,
            categoryId: 1,
            payment_method: 'credit card',
            userId: 'user-123',
        });

        const updateData: UpdateExpenseUseCaseRequest = {
            id: expense.id,
            description: 'Updated Description',
            date: new Date('2025-03-15'),
            value: 75,
            categoryId: 2,
            payment_method: 'debit card',
            userId: 'user-123',
        };

        const { expense: updatedExpense } = await sut.execute(updateData);

        expect(updatedExpense.id).toEqual(expense.id);
        expect(updatedExpense.description).toBe(updateData.description);
        expect(updatedExpense.date).toEqual(updateData.date);
        expect(updatedExpense.value.toNumber()).toBe(updateData.value);
        expect(updatedExpense.categoryId).toBe(updateData.categoryId);
        expect(updatedExpense.payment_method).toBe(updateData.payment_method);
        expect(updatedExpense.userId).toBe(updateData.userId);
    });

    it('should not allow update of expense with negative value', async () => {
        const expense = await expensesRepository.create({
            description: 'Original Description',
            date: new Date('2025-03-01'),
            value: 50,
            categoryId: 1,
            payment_method: 'credit card',
            userId: 'user-123',
        });

        const updateData: UpdateExpenseUseCaseRequest = {
            id: expense.id,
            description: 'Updated Description',
            date: new Date('2025-03-15'),
            value: -75,
            categoryId: 2,
            payment_method: 'debit card',
            userId: 'user-123',
        };

        await expect(sut.execute(updateData))
            .rejects.toThrow('Expense value cannot be negative');
    });

    it('should not allow update of expense without a category', async () => {
        const expense = await expensesRepository.create({
            description: 'Original Description',
            date: new Date('2025-03-01'),
            value: 50,
            categoryId: 1,
            payment_method: 'credit card',
            userId: 'user-123',
        });

        const updateData = {
            id: expense.id,
            description: 'Updated Description',
            date: new Date('2025-03-15'),
            value: 75,
            payment_method: 'debit card',
            userId: 'user-123',
        } as unknown as UpdateExpenseUseCaseRequest;

        await expect(sut.execute(updateData))
            .rejects.toThrow('Expense must have a category');
    });

    it('should not allow update of non-existent expense', async () => {
        const updateData: UpdateExpenseUseCaseRequest = {
            id: 9999,
            description: 'Updated Description',
            date: new Date('2025-03-15'),
            value: 75,
            categoryId: 2,
            payment_method: 'debit card',
            userId: 'user-123',
        };

        await expect(sut.execute(updateData))
            .rejects.toThrow('Expense not found');
    });

    it('should not allow update of expense by different user', async () => {
        const expense = await expensesRepository.create({
            description: 'Original Description',
            date: new Date('2025-03-01'),
            value: 50,
            categoryId: 1,
            payment_method: 'credit card',
            userId: 'user-123',
        });

        const updateData: UpdateExpenseUseCaseRequest = {
            id: expense.id,
            description: 'Updated Description',
            date: new Date('2025-03-15'),
            value: 75,
            categoryId: 2,
            payment_method: 'debit card',
            userId: 'user-456',
        };

        await expect(sut.execute(updateData))
            .rejects.toThrow('Not authorized to update this expense');
    });
});