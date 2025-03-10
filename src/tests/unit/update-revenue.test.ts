import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { UpdateRevenueUseCase } from '@/use-cases/revenues-use-cases/update-revenue';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { beforeEach, describe, expect, it } from 'vitest';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: UpdateRevenueUseCase;

describe('Update Revenue Use Case', () => {
  beforeEach(() => {
    revenuesRepository = new InMemoryRevenuesRepository();
    sut = new UpdateRevenueUseCase(revenuesRepository);
  });

  it('should be able to update a revenue', async () => {
    const revenue = await revenuesRepository.create({
      description: 'Original Description',
      date: new Date('2025-03-01'),
      value: 1000,
      categoryId: 1,
      income_source: 'Salary',
      userId: 'user-123',
    });

    const updateData = {
      id: revenue.id,
      description: 'Updated Description',
      date: new Date('2025-03-15'),
      value: 1500,
      categoryId: 2,
      income_source: 'Freelance',
      userId: 'user-123',
    };

    const { revenue: updatedRevenue } = await sut.execute(updateData);

    expect(updatedRevenue.id).toEqual(revenue.id);
    expect(updatedRevenue.description).toBe(updateData.description);
    expect(updatedRevenue.date).toEqual(updateData.date);
    expect(updatedRevenue.value.toNumber()).toBe(updateData.value);
    expect(updatedRevenue.categoryId).toBe(updateData.categoryId);
    expect(updatedRevenue.income_source).toBe(updateData.income_source);
    expect(updatedRevenue.userId).toBe(updateData.userId);
  });

  it('should not allow update of revenue with negative value', async () => {
    const revenue = await revenuesRepository.create({
      description: 'Original Description',
      date: new Date('2025-03-01'),
      value: 1000,
      categoryId: 1,
      income_source: 'Salary',
      userId: 'user-123',
    });

    const updateData = {
      id: revenue.id,
      description: 'Updated Description',
      date: new Date('2025-03-15'),
      value: -1500,
      categoryId: 2,
      income_source: 'Freelance',
      userId: 'user-123',
    };

    await expect(sut.execute(updateData))
      .rejects.toThrow('Revenue value cannot be negative');
  });

  it('should not allow update of revenue without a category', async () => {
    const revenue = await revenuesRepository.create({
      description: 'Original Description',
      date: new Date('2025-03-01'),
      value: 1000,
      categoryId: 1,
      income_source: 'Salary',
      userId: 'user-123',
    });

    const updateData = {
      id: revenue.id,
      description: 'Updated Description',
      date: new Date('2025-03-15'),
      value: 1500,
      income_source: 'Freelance',
      userId: 'user-123',
    } as any; 

    await expect(sut.execute(updateData))
      .rejects.toThrow('Revenue must have a category');
  });

  it('should not allow update of non-existent revenue', async () => {
    const updateData = {
      id: 9999,
      description: 'Updated Description',
      date: new Date('2025-03-15'),
      value: 1500,
      categoryId: 2,
      income_source: 'Freelance',
      userId: 'user-123',
    };

    await expect(sut.execute(updateData))
      .rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow update of revenue by different user', async () => {
    const revenue = await revenuesRepository.create({
      description: 'Original Description',
      date: new Date('2025-03-01'),
      value: 1000,
      categoryId: 1,
      income_source: 'Salary',
      userId: 'user-123',
    });

    const updateData = {
      id: revenue.id,
      description: 'Updated Description',
      date: new Date('2025-03-15'),
      value: 1500,
      categoryId: 2,
      income_source: 'Freelance',
      userId: 'user-456',
    };

    await expect(sut.execute(updateData))
      .rejects.toThrow('Not authorized to update this revenue');
  });

  it('should update a revenue with optional income_source', async () => {
    const userId = 'user-123';
    

    const createdRevenue = await revenuesRepository.create({
      description: 'Original Revenue',
      date: new Date('2025-03-01'),
      value: 1000,
      categoryId: 1,
      income_source: 'Salary',
      userId,
    });

    const { revenue } = await sut.execute({
      id: createdRevenue.id,
      description: 'Updated Revenue',
      date: new Date('2025-03-15'),
      value: 1500,
      categoryId: 2,
      userId,
    });

    expect(revenue.income_source).toEqual(null); 
    

    const updatedAgain = await sut.execute({
      id: createdRevenue.id,
      description: 'Updated Again',
      date: new Date('2025-03-20'),
      value: 2000,
      categoryId: 3,
      income_source: 'Investment',
      userId,
    });

    expect(updatedAgain.revenue.income_source).toEqual('Investment');
  });

  it('should maintain the same userId when updating a revenue', async () => {
    const userId = 'user-123';
    

    const createdRevenue = await revenuesRepository.create({
      description: 'Original Revenue',
      date: new Date('2025-03-01'),
      value: 1000,
      categoryId: 1,
      userId,
    });

    const { revenue } = await sut.execute({
      id: createdRevenue.id,
      description: 'Updated Revenue',
      date: new Date('2025-03-15'),
      value: 1500,
      categoryId: 2,
      userId,
    });

    expect(revenue.userId).toEqual(userId);
  });
});