import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { GetFinancialSummaryUseCase } from '@/use-cases/reports/get-financial-summary';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let revenuesRepository: InMemoryRevenuesRepository;
let sut: GetFinancialSummaryUseCase;

describe('Get Financial Summary Use Case', () => {
    beforeEach(() => {
        expensesRepository = new InMemoryExpensesRepository();
        revenuesRepository = new InMemoryRevenuesRepository();
        sut = new GetFinancialSummaryUseCase(
            expensesRepository,
            revenuesRepository
        );
    });

    it('should be able to get financial summary', async () => {
        await revenuesRepository.create({
            description: 'Salary',
            date: new Date('2023-01-10'),
            value: 5000,
            categoryId: 1,
            userId: 'user-01',
        });

        await revenuesRepository.create({
            description: 'Freelance',
            date: new Date('2023-01-15'),
            value: 2000,
            categoryId: 1,
            userId: 'user-01',
        });


        await expensesRepository.create({
            description: 'Rent',
            date: new Date('2023-01-05'),
            value: 1500,
            categoryId: 2,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: 3,
            userId: 'user-01',
        });

        const { totalIncome, totalExpenses, netBalance } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(7000));
        expect(totalExpenses).toEqual(new Prisma.Decimal(2000));
        expect(netBalance).toEqual(new Prisma.Decimal(5000));
    });

    it('should be able to get financial summary with date filter', async () => {
        await revenuesRepository.create({
            description: 'Salary January',
            date: new Date('2023-01-10'),
            value: 5000,
            categoryId: 1,
            userId: 'user-01',
        });

        await revenuesRepository.create({
            description: 'Salary February',
            date: new Date('2023-02-10'),
            value: 5000,
            categoryId: 1,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Rent January',
            date: new Date('2023-01-05'),
            value: 1500,
            categoryId: 2,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Rent February',
            date: new Date('2023-02-05'),
            value: 1500,
            categoryId: 2,
            userId: 'user-01',
        });

        const { totalIncome, totalExpenses, netBalance } = await sut.execute({
            userId: 'user-01',
            startDate: '2023-02-01',
            endDate: '2023-02-28',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(5000));
        expect(totalExpenses).toEqual(new Prisma.Decimal(1500));
        expect(netBalance).toEqual(new Prisma.Decimal(3500));
    });

    it('should return zero values when no transactions exist', async () => {
        const { totalIncome, totalExpenses, netBalance } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(0));
        expect(totalExpenses).toEqual(new Prisma.Decimal(0));
        expect(netBalance).toEqual(new Prisma.Decimal(0));
    });

    it('should only include transactions from the specified user', async () => {
        await revenuesRepository.create({
            description: 'Salary',
            date: new Date('2023-01-10'),
            value: 5000,
            categoryId: 1,
            userId: 'user-01',
        });

        await revenuesRepository.create({
            description: 'Salary',
            date: new Date('2023-01-10'),
            value: 6000,
            categoryId: 1,
            userId: 'user-02',
        });

        await expensesRepository.create({
            description: 'Rent',
            date: new Date('2023-01-05'),
            value: 1500,
            categoryId: 2,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Rent',
            date: new Date('2023-01-05'),
            value: 2000,
            categoryId: 2,
            userId: 'user-02',
        });

        const { totalIncome, totalExpenses, netBalance } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalIncome).toEqual(new Prisma.Decimal(5000));
        expect(totalExpenses).toEqual(new Prisma.Decimal(1500));
        expect(netBalance).toEqual(new Prisma.Decimal(3500));
    });
}); 