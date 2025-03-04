import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { CreateExpenseUseCase } from '@/use-cases/create-expense';

let expensesRepository: InMemoryExpensesRepository;
let sut: CreateExpenseUseCase;

describe('Create Expense Use Case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository();
    sut = new CreateExpenseUseCase(expensesRepository);
  });

  it('should be able to create an expense', async () => {
    const expenseData = {
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
  });
});
