import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { CreateExpenseUseCase, CreateExpenseUseCaseRequest } from '@/use-cases/expenses/create-expense';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let checkExpenseThresholdUseCase: any;
let sut: CreateExpenseUseCase;

describe('Create Expense Use Case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository();

    checkExpenseThresholdUseCase = {
      execute: vi.fn().mockResolvedValue(undefined)
    };

    sut = new CreateExpenseUseCase(
      expensesRepository,
      checkExpenseThresholdUseCase
    );
  });

  it('should be able to create an expense', async () => {
    const expenseData: CreateExpenseUseCaseRequest = {
      description: 'Lunch at Restaurant',
      date: new Date('2025-03-01'),
      value: 50,
      categoryId: 1,
      payment_method: 'credit card',
      userId: 'user-123',
    };

    const { expense } = await sut.execute(expenseData);

    expect(expense.id).toEqual(expect.any(Number));
    expect(expense.description).toBe(expenseData.description);
    expect(expense.date).toEqual(expenseData.date);
    expect(expense.value.toNumber()).toBe(expenseData.value);
    expect(expense.categoryId).toBe(expenseData.categoryId);
    expect(expense.payment_method).toBe(expenseData.payment_method);
    expect(expense.userId).toBe(expenseData.userId);

    expect(checkExpenseThresholdUseCase.execute).toHaveBeenCalledWith({
      userId: expenseData.userId,
      year: expenseData.date.getFullYear(),
      month: expenseData.date.getMonth() + 1,
    });
  });

  it('should not allow creation of expense with negative value', async () => {
    const expenseData: CreateExpenseUseCaseRequest = {
      description: 'Negative Expense',
      date: new Date('2025-03-01'),
      value: -20,
      categoryId: 1,
      payment_method: 'credit card',
      userId: 'user-123',
    };

    await expect(sut.execute(expenseData))
      .rejects.toThrow('Expense value cannot be negative');

    expect(checkExpenseThresholdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should not allow creation of expense without a category', async () => {
    const expenseData = {
      description: 'No Category Expense',
      date: new Date('2025-03-01'),
      value: 30,
      payment_method: 'credit card',
      userId: 'user-123',
    } as unknown as CreateExpenseUseCaseRequest;

    await expect(sut.execute(expenseData))
      .rejects.toThrow('Expense must have a category');

    expect(checkExpenseThresholdUseCase.execute).not.toHaveBeenCalled();
  });
});
