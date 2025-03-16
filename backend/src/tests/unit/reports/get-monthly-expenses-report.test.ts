import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { GetMonthlyExpensesReportUseCase } from '@/use-cases/reports/get-monthly-expenses-report';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

let expensesRepository: InMemoryExpensesRepository;
let sut: GetMonthlyExpensesReportUseCase;

describe('Get Monthly Expenses Report Use Case', () => {
    beforeEach(() => {
        expensesRepository = new InMemoryExpensesRepository();
        sut = new GetMonthlyExpensesReportUseCase(expensesRepository);
    });

    it('should be able to get monthly expenses report', async () => {
        await expensesRepository.create({
            description: 'Rent',
            date: new Date('2023-01-05'),
            value: 1500,
            categoryId: 1,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: 2,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Utilities',
            date: new Date('2023-02-10'),
            value: 300,
            categoryId: 3,
            userId: 'user-01',
        });

        const { monthlyExpenses } = await sut.execute({
            userId: 'user-01',
            year: 2023,
        });

        expect(monthlyExpenses).toHaveLength(12);
        expect(monthlyExpenses[0].total).toEqual(new Prisma.Decimal(2000)); 
        expect(monthlyExpenses[1].total).toEqual(new Prisma.Decimal(300)); 
        expect(monthlyExpenses[2].total).toEqual(new Prisma.Decimal(0));
    });

    it('should return zero for months with no expenses', async () => {
        const { monthlyExpenses } = await sut.execute({
            userId: 'user-01',
            year: 2023,
        });

        expect(monthlyExpenses).toHaveLength(12);
        monthlyExpenses.forEach(month => {
            expect(month.total).toEqual(new Prisma.Decimal(0));
        });
    });

    it('should only include expenses from the specified user', async () => {
        await expensesRepository.create({
            description: 'Rent',
            date: new Date('2023-01-05'),
            value: 1500,
            categoryId: 1,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: 2,
            userId: 'user-02',
        });

        const { monthlyExpenses } = await sut.execute({
            userId: 'user-01',
            year: 2023,
        });

        expect(monthlyExpenses[0].total).toEqual(new Prisma.Decimal(1500));
    });
}); 