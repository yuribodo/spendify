import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { CreateRevenueUseCase, CreateRevenueUseCaseRequest } from '@/use-cases/revenues/create-revenue';
import { beforeEach, describe, expect, it } from 'vitest';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: CreateRevenueUseCase;

describe('Create Revenue Use Case', () => {
  beforeEach(() => {
    revenuesRepository = new InMemoryRevenuesRepository();
    sut = new CreateRevenueUseCase(revenuesRepository);
  });

  it('should be able to create a revenue', async () => {
    const revenueData: CreateRevenueUseCaseRequest = {
      description: 'Salary Payment',
      date: new Date('2025-03-01'),
      value: 3000,
      categoryId: 1,
      income_source: 'employment',
      userId: 'user-123',
    };

    const { revenue } = await sut.execute(revenueData);

    expect(revenue.id).toEqual(expect.any(Number));
    expect(revenue.description).toBe(revenueData.description);
    expect(revenue.date).toEqual(revenueData.date);
    expect(revenue.value.toNumber()).toBe(revenueData.value);
    expect(revenue.categoryId).toBe(revenueData.categoryId);
    expect(revenue.income_source).toBe(revenueData.income_source);
    expect(revenue.userId).toBe(revenueData.userId);
  });

  it('should not allow creation of revenue with negative value', async () => {
    const revenueData: CreateRevenueUseCaseRequest = {
      description: 'Negative Revenue',
      date: new Date('2025-03-01'),
      value: -500,
      categoryId: 1,
      income_source: 'freelance',
      userId: 'user-123',
    };

    await expect(sut.execute(revenueData))
      .rejects.toThrow('Revenue value cannot be negative');
  });

  it('should not allow creation of revenue without a category', async () => {
    const revenueData = {
      description: 'No Category Revenue',
      date: new Date('2025-03-01'),
      value: 1000,
      income_source: 'freelance',
      userId: 'user-123',
    } as unknown as CreateRevenueUseCaseRequest;

    await expect(sut.execute(revenueData))
      .rejects.toThrow('Revenue must have a category');
  });
});