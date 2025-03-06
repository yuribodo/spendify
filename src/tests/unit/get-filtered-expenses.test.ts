import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { GetFilteredExpensesUseCase } from '@/use-cases/expense-use-cases/get-filtered-expenses';
import { beforeEach, describe, expect, it } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let sut: GetFilteredExpensesUseCase;

describe('Get Filtered Expenses Use Case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository();
    sut = new GetFilteredExpensesUseCase(expensesRepository);
  });

  it('should filter expenses by date range', async () => {
    const userId = 'user-123';
    await expensesRepository.create({
      description: 'Expense 1',
      date: new Date('2025-03-01'),
      value: 50,
      categoryId: 1,
      userId,
    });
    await expensesRepository.create({
      description: 'Expense 2',
      date: new Date('2025-03-15'),
      value: 75,
      categoryId: 1,
      userId,
    });
    await expensesRepository.create({
      description: 'Expense 3',
      date: new Date('2025-04-01'),
      value: 100,
      categoryId: 1,
      userId,
    });

    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId,
      startDate: '2025-03-01',
      endDate: '2025-03-31',
    });

    expect(expenses).toHaveLength(2);
    expect(totalCount).toBe(2);
  });

  it('should filter expenses by category', async () => {
    const userId = 'user-123';
    await expensesRepository.create({
      description: 'Expense A',
      date: new Date('2025-03-10'),
      value: 20,
      categoryId: 1,
      userId,
    });
    await expensesRepository.create({
      description: 'Expense B',
      date: new Date('2025-03-10'),
      value: 30,
      categoryId: 2,
      userId,
    });

    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId,
      category: 1,
    });

    expect(expenses).toHaveLength(1);
    expect(expenses[0].description).toBe('Expense A');
    expect(totalCount).toBe(1);
  });

  it('should filter expenses by payment method', async () => {
    const userId = 'user-123';
    await expensesRepository.create({
      description: 'Expense Credit',
      date: new Date('2025-03-10'),
      value: 100,
      categoryId: 1,
      payment_method: 'credit',
      userId,
    });
    await expensesRepository.create({
      description: 'Expense Cash',
      date: new Date('2025-03-10'),
      value: 100,
      categoryId: 1,
      payment_method: 'cash',
      userId,
    });

    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId,
      payment_method: 'credit',
    });

    expect(expenses).toHaveLength(1);
    expect(expenses[0].description).toBe('Expense Credit');
    expect(totalCount).toBe(1);
  });

  it('should filter expenses by amount range', async () => {
    const userId = 'user-123';
    await expensesRepository.create({
      description: 'Expense Low',
      date: new Date('2025-03-10'),
      value: 50,
      categoryId: 1,
      userId,
    });
    await expensesRepository.create({
      description: 'Expense Mid',
      date: new Date('2025-03-10'),
      value: 150,
      categoryId: 1,
      userId,
    });
    await expensesRepository.create({
      description: 'Expense High',
      date: new Date('2025-03-10'),
      value: 300,
      categoryId: 1,
      userId,
    });

    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId,
      minAmount: 100,
      maxAmount: 200,
    });

    expect(expenses).toHaveLength(1);
    expect(expenses[0].description).toBe('Expense Mid');
    expect(totalCount).toBe(1);
  });

  it('should combine multiple filters', async () => {
    const userId = 'user-123';
    await expensesRepository.create({
      description: 'Expense Combined 1',
      date: new Date('2025-03-10'),
      value: 100,
      categoryId: 1,
      payment_method: 'credit',
      userId,
    });
    await expensesRepository.create({
      description: 'Expense Combined 2',
      date: new Date('2025-03-20'),
      value: 200,
      categoryId: 2,
      payment_method: 'debit',
      userId,
    });
    await expensesRepository.create({
      description: 'Expense Combined 3',
      date: new Date('2025-04-05'),
      value: 150,
      categoryId: 1,
      payment_method: 'credit',
      userId,
    });

    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId,
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      category: 1,
      payment_method: 'credit',
      minAmount: 50,
      maxAmount: 150,
    });

    expect(expenses).toHaveLength(1);
    expect(expenses[0].description).toBe('Expense Combined 1');
    expect(totalCount).toBe(1);
  });
});
