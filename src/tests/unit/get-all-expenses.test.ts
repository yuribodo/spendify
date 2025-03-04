import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { GetAllExpensesUseCase } from '@/use-cases/get-all-expenses';

let expensesRepository: InMemoryExpensesRepository;
let sut: GetAllExpensesUseCase;

describe('Get All Expenses Use Case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository();
    sut = new GetAllExpensesUseCase(expensesRepository);
  });

  it('should be able to fetch paginated expenses', async () => {
    const userId = 'user-123';
    for (let i = 1; i <= 25; i++) {
      await expensesRepository.create({
        description: `Expense ${i}`,
        date: new Date(`2025-03-${i <= 9 ? '0' + i : i}`), 
        value: i * 10, 
        categoryId: 1,
        userId,
      });
    }

    for (let i = 1; i <= 5; i++) {
      await expensesRepository.create({
        description: `Other User Expense ${i}`,
        date: new Date(`2025-03-${i}`),
        value: i * 100,
        categoryId: 1,
        userId: 'other-user',
      });
    }

    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId,
    });

    expect(expenses).toHaveLength(10);
    expect(totalCount).toBe(25); 
    
    expect(expenses[0].description).toBe('Expense 25');
    expect(expenses[1].description).toBe('Expense 24');
    
    const page2Result = await sut.execute({
      page: 2,
      perPage: 10,
      userId,
    });
    
    expect(page2Result.expenses).toHaveLength(10);
    expect(page2Result.expenses[0].description).toBe('Expense 15');
    
    const page3Result = await sut.execute({
      page: 3,
      perPage: 10,
      userId,
    });
    
    expect(page3Result.expenses).toHaveLength(5);
    expect(page3Result.expenses[0].description).toBe('Expense 5');
    
    const customPageSizeResult = await sut.execute({
      page: 1,
      perPage: 20,
      userId,
    });
    
    expect(customPageSizeResult.expenses).toHaveLength(20);
  });

  it('should return empty array when no expenses are found', async () => {
    const { expenses, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'non-existent-user',
    });
    
    expect(expenses).toHaveLength(0);
    expect(totalCount).toBe(0);
  });
});