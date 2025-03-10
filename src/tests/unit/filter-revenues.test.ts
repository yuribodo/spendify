import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { FilterRevenuesUseCase } from '@/use-cases/revenues-use-cases/filter-revenue';
import { beforeEach, describe, expect, it } from 'vitest';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: FilterRevenuesUseCase;

describe('Filter Revenues Use Case', () => {
  beforeEach(() => {
    revenuesRepository = new InMemoryRevenuesRepository();
    sut = new FilterRevenuesUseCase(revenuesRepository);


    const seedData = [
      {
        description: 'Salary',
        date: new Date('2025-01-10'),
        value: 3000,
        categoryId: 1, 
        income_source: 'employment',
        userId: 'user-123',
      },
      {
        description: 'Freelance Project',
        date: new Date('2025-01-20'),
        value: 1500,
        categoryId: 2, 
        income_source: 'freelance',
        userId: 'user-123',
      },
      {
        description: 'Stock Dividends',
        date: new Date('2025-02-05'),
        value: 500,
        categoryId: 3,
        income_source: 'investments',
        userId: 'user-123',
      },
      {
        description: 'Rental Income',
        date: new Date('2025-02-15'),
        value: 1200,
        categoryId: 4,
        income_source: 'real estate',
        userId: 'user-123',
      },
      {
        description: 'Another Salary',
        date: new Date('2025-03-10'),
        value: 3100,
        categoryId: 1, 
        income_source: 'employment',
        userId: 'user-123',
      },
      {
        description: 'Other User Salary',
        date: new Date('2025-03-10'),
        value: 2500,
        categoryId: 1, 
        income_source: 'employment',
        userId: 'user-456',
      },
    ];

    seedData.forEach(async (data) => {
      await revenuesRepository.create(data);
    });
  });

  it('should filter revenues by date range', async () => {
    const { revenues } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
    });

    expect(revenues).toHaveLength(2);
    expect(revenues[0].description).toBe('Rental Income');
    expect(revenues[1].description).toBe('Stock Dividends');
  });

  it('should filter revenues by category', async () => {
    const { revenues } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
      category: 1, 
    });

    expect(revenues).toHaveLength(2);
    expect(revenues.every(revenue => revenue.categoryId === 1)).toBe(true);
  });

  it('should filter revenues by income source', async () => {
    const { revenues } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
      income_source: 'freelance',
    });

    expect(revenues).toHaveLength(1);
    expect(revenues[0].description).toBe('Freelance Project');
    expect(revenues[0].income_source).toBe('freelance');
  });

  it('should filter revenues by amount range', async () => {
    const { revenues } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
      minAmount: 1000,
      maxAmount: 2000,
    });

    expect(revenues).toHaveLength(2);
    expect(revenues.every(revenue => {
      const value = revenue.value.toNumber();
      return value >= 1000 && value <= 2000;
    })).toBe(true);
  });

  it('should combine multiple filters', async () => {
    const { revenues } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      category: 1, 
      income_source: 'employment',
      minAmount: 3000,
    });

    expect(revenues).toHaveLength(2);
    expect(revenues.every(revenue => 
      revenue.categoryId === 1 && 
      revenue.income_source === 'employment' && 
      revenue.value.toNumber() >= 3000
    )).toBe(true);
  });

  it('should return only revenues from the specified user', async () => {
    const { revenues } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
    });

    expect(revenues).toHaveLength(5);
    expect(revenues.every(revenue => revenue.userId === 'user-123')).toBe(true);
  });
});