import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { GetRevenueDetailsUseCase } from '@/use-cases/revenues/get-revenue-details';
import { beforeEach, describe, expect, it } from 'vitest';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: GetRevenueDetailsUseCase;

describe('Get Revenue Details Use Case', () => {
  beforeEach(() => {
    revenuesRepository = new InMemoryRevenuesRepository();
    sut = new GetRevenueDetailsUseCase(revenuesRepository);
  });

  it('should be able to get revenue details', async () => {
    const createdRevenue = await revenuesRepository.create({
      description: 'Salary Payment',
      date: new Date('2025-03-01'),
      value: 3000,
      categoryId: 1,
      income_source: 'employment',
      userId: 'user-123',
    });

    const { revenue } = await sut.execute({
      id: createdRevenue.id,
      userId: 'user-123',
    });

    expect(revenue.id).toEqual(createdRevenue.id);
    expect(revenue.description).toBe('Salary Payment');
    expect(revenue.value.toNumber()).toBe(3000);
    expect(revenue.income_source).toBe('employment');
  });

  it('should not be able to get details of non-existent revenue', async () => {
    await expect(() =>
      sut.execute({
        id: 999,
        userId: 'user-123',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to get details of revenue from another user', async () => {
    const createdRevenue = await revenuesRepository.create({
      description: 'Other User Salary',
      date: new Date('2025-03-01'),
      value: 2500,
      categoryId: 1,
      income_source: 'employment',
      userId: 'user-456',
    });

    await expect(() =>
      sut.execute({
        id: createdRevenue.id,
        userId: 'user-123',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});