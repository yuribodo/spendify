import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { GetIncomeBySourceReportUseCase } from '@/use-cases/reports/get-income-by-source-report';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

let revenuesRepository: InMemoryRevenuesRepository;
let sut: GetIncomeBySourceReportUseCase;

describe('Get Income By Source Report Use Case', () => {
    beforeEach(() => {
        revenuesRepository = new InMemoryRevenuesRepository();
        sut = new GetIncomeBySourceReportUseCase(revenuesRepository);
    });

    it('should be able to get income by source report', async () => {
        await revenuesRepository.create({
            description: 'Salary',
            date: new Date('2023-01-10'),
            value: 5000,
            categoryId: 1,
            income_source: 'Job',
            userId: 'user-01',
        });

        await revenuesRepository.create({
            description: 'Freelance',
            date: new Date('2023-01-15'),
            value: 2000,
            categoryId: 1,
            income_source: 'Freelance',
            userId: 'user-01',
        });

        const { incomeSources, totalIncome } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(7000));
        expect(incomeSources).toHaveLength(2);
        expect(incomeSources[0].source).toBe('Job');
        expect(incomeSources[0].total).toEqual(new Prisma.Decimal(5000));
        expect(incomeSources[0].percentage).toBeCloseTo(71.43, 2);
        expect(incomeSources[1].source).toBe('Freelance');
        expect(incomeSources[1].total).toEqual(new Prisma.Decimal(2000));
        expect(incomeSources[1].percentage).toBeCloseTo(28.57, 2);
    });

    it('should return zero total income when no revenues exist', async () => {
        const { incomeSources, totalIncome } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(0));
        expect(incomeSources).toHaveLength(0);
    });

    it('should only include revenues from the specified user', async () => {
        await revenuesRepository.create({
            description: 'Salary',
            date: new Date('2023-01-10'),
            value: 5000,
            categoryId: 1,
            income_source: 'Job',
            userId: 'user-01',
        });

        await revenuesRepository.create({
            description: 'Salary',
            date: new Date('2023-01-10'),
            value: 3000,
            categoryId: 1,
            income_source: 'Job',
            userId: 'user-02',
        });

        const { incomeSources, totalIncome } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(5000));
        expect(incomeSources).toHaveLength(1);
        expect(incomeSources[0].source).toBe('Job');
        expect(incomeSources[0].total).toEqual(new Prisma.Decimal(5000));
    });
}); 