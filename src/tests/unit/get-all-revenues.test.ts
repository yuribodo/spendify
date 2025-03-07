import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { GetAllRevenuesUseCase } from '@/use-cases/revenues-use-cases/get-all-revenues';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prisma } from '@prisma/client';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: GetAllRevenuesUseCase;

describe('Get All Revenues Use Case', () => {
  beforeEach(() => {
    revenuesRepository = new InMemoryRevenuesRepository();
    sut = new GetAllRevenuesUseCase(revenuesRepository);
  });

  it('should be able to get paginated revenues', async () => {
    for (let i = 1; i <= 22; i++) {
      await revenuesRepository.create({
        description: `Revenue ${i}`,
        date: new Date(`2025-03-${i < 10 ? '0' + i : i}`),
        value: i * 100,
        categoryId: 1,
        userId: 'user-123',
      });
    }

    const { revenues, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
    });

    expect(revenues).toHaveLength(10);
    expect(totalCount).toBe(22);
    expect(revenues[0].description).toBe('Revenue 22');
  });

  it('should be able to get the second page', async () => {
    for (let i = 1; i <= 22; i++) {
      await revenuesRepository.create({
        description: `Revenue ${i}`,
        date: new Date(`2025-03-${i < 10 ? '0' + i : i}`),
        value: i * 100,
        categoryId: 1,
        userId: 'user-123',
      });
    }

    const { revenues, totalCount } = await sut.execute({
      page: 2,
      perPage: 10,
      userId: 'user-123',
    });

    expect(revenues).toHaveLength(10);
    expect(totalCount).toBe(22);
    expect(revenues[0].description).toBe('Revenue 12'); 
  });

  it('should return only revenues from the specified user', async () => {
    for (let i = 1; i <= 5; i++) {
      await revenuesRepository.create({
        description: `User 1 Revenue ${i}`,
        date: new Date(`2025-03-${i < 10 ? '0' + i : i}`),
        value: i * 100,
        categoryId: 1,
        userId: 'user-123',
      });
    }

    for (let i = 1; i <= 3; i++) {
      await revenuesRepository.create({
        description: `User 2 Revenue ${i}`,
        date: new Date(`2025-03-${i < 10 ? '0' + i : i}`),
        value: i * 200,
        categoryId: 1,
        userId: 'user-456',
      });
    }

    const { revenues, totalCount } = await sut.execute({
      page: 1,
      perPage: 10,
      userId: 'user-123',
    });

    expect(revenues).toHaveLength(5);
    expect(totalCount).toBe(5);
    expect(revenues.every(revenue => revenue.userId === 'user-123')).toBe(true);
  });
});