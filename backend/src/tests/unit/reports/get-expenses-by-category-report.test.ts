import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { GetExpensesByCategoryReportUseCase } from '@/use-cases/reports/get-expenses-by-category-report';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';

let categoriesRepository: InMemoryCategoriesRepository;
let expensesRepository: InMemoryExpensesRepository;
let sut: GetExpensesByCategoryReportUseCase;

describe('Get Expenses By Category Report Use Case', () => {
    beforeEach(() => {
        categoriesRepository = new InMemoryCategoriesRepository();
        expensesRepository = new InMemoryExpensesRepository();
        sut = new GetExpensesByCategoryReportUseCase(expensesRepository, categoriesRepository);
    });

    it('should be able to get expenses by category report', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });
        const utilitiesCategory = await categoriesRepository.create({ title: 'Utilities' });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Electricity',
            date: new Date('2023-01-25'),
            value: 200,
            categoryId: utilitiesCategory.id,
            userId: 'user-01',
        });

        const { categoryExpenses, totalExpenses } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalExpenses).toEqual(new Prisma.Decimal(700));
        expect(categoryExpenses).toHaveLength(2);
        expect(categoryExpenses[0].categoryTitle).toBe('Food');
        expect(categoryExpenses[0].total).toEqual(new Prisma.Decimal(500));
        expect(categoryExpenses[0].percentage).toBeCloseTo(71.43, 2);
        expect(categoryExpenses[1].categoryTitle).toBe('Utilities');
        expect(categoryExpenses[1].total).toEqual(new Prisma.Decimal(200));
        expect(categoryExpenses[1].percentage).toBeCloseTo(28.57, 2);
    });

    it('should return zero total expenses when no expenses exist', async () => {
        const { categoryExpenses, totalExpenses } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalExpenses).toEqual(new Prisma.Decimal(0));
        expect(categoryExpenses).toHaveLength(0);
    });

    it('should only include expenses from the specified user', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 300,
            categoryId: foodCategory.id,
            userId: 'user-02',
        });

        const { categoryExpenses, totalExpenses } = await sut.execute({
            userId: 'user-01',
        });

        expect(totalExpenses).toEqual(new Prisma.Decimal(500));
        expect(categoryExpenses).toHaveLength(1);
        expect(categoryExpenses[0].categoryTitle).toBe('Food');
        expect(categoryExpenses[0].total).toEqual(new Prisma.Decimal(500));
    });
}); 