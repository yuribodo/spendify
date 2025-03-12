import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { DeleteRevenueUseCase } from '@/use-cases/revenues/delete-revenue';
import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from 'vitest';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: DeleteRevenueUseCase;

describe('Delete Revenue Use Case', () => {
  beforeEach(() => {
    revenuesRepository = new InMemoryRevenuesRepository();
    sut = new DeleteRevenueUseCase(revenuesRepository);
  });

  it('should delete a revenue if it exists and belongs to the user', async () => {
    const revenue = {
      id: 1,
      description: 'Test Revenue',
      date: new Date('2025-03-01'),
      value: new Prisma.Decimal(1000),
      categoryId: 1,
      income_source: 'Salary',
      userId: 'user-123'
    };

    revenuesRepository.items.push(revenue);

    await sut.execute({ id: revenue.id, userId: revenue.userId });

    const foundRevenue = await revenuesRepository.findById({ id: revenue.id, userId: null });
    expect(foundRevenue).toBeNull();
  });

  it('should throw an error if the revenue does not exist', async () => {
    await expect(
      sut.execute({ id: 999, userId: 'user-123' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw an error if the user is not authorized to delete the revenue', async () => {
    const revenue = {
      id: 1,
      description: 'Test Revenue',
      date: new Date('2025-03-01'),
      value: new Prisma.Decimal(1000),
      categoryId: 1,
      income_source: 'Salary',
      userId: 'user-123'
    };

    revenuesRepository.items.push(revenue);

    await expect(
      sut.execute({ id: revenue.id, userId: 'user-456' })
    ).rejects.toThrow('Not authorized to delete this revenue');
  });
});