import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { GetExpenseDetailsUseCase } from '@/use-cases/expense-use-cases/get-expense-details';
import { beforeEach, describe, expect, it } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let sut: GetExpenseDetailsUseCase;

describe('Get Expense Details Use Case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository();
    sut = new GetExpenseDetailsUseCase(expensesRepository);
  });

  it('should return the expense details when the expense exists', async () => {
    const userId = 'user-123';
    const createdExpense = await expensesRepository.create({
      description: 'Test Expense',
      date: new Date('2025-03-10'),
      value: 100,
      categoryId: 1,
      payment_method: 'credit',
      userId,
    });

    const expenseDetails = await sut.execute({
      id: createdExpense.id,
      userId,
    });

    expect(expenseDetails).toBeDefined();
    expect(expenseDetails.id).toBe(createdExpense.id);
    expect(expenseDetails.description).toBe('Test Expense');
  });

  it('should throw an error when the expense does not exist', async () => {
    const userId = 'user-123';

    await expect(sut.execute({ id: 999, userId })).rejects.toThrow("Expense not found");
  });

  it('should throw an error when the expense exists but belongs to another user', async () => {
    const userId = 'user-123';
    const createdExpense = await expensesRepository.create({
      description: 'Other User Expense',
      date: new Date('2025-03-10'),
      value: 100,
      categoryId: 1,
      payment_method: 'credit',
      userId: 'different-user',
    });

    await expect(sut.execute({ id: createdExpense.id, userId })).rejects.toThrow("Expense not found");
  });
});
