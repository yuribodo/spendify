import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { ExportFinancialDataUseCase } from '@/use-cases/export/export-financial-data';
import { beforeEach, describe, expect, it } from 'vitest';

let categoriesRepository: InMemoryCategoriesRepository;
let expensesRepository: InMemoryExpensesRepository;
let revenuesRepository: InMemoryRevenuesRepository;
let sut: ExportFinancialDataUseCase;

describe('Export Financial Data Use Case', () => {
    beforeEach(() => {
        categoriesRepository = new InMemoryCategoriesRepository();
        expensesRepository = new InMemoryExpensesRepository();
        revenuesRepository = new InMemoryRevenuesRepository();
        sut = new ExportFinancialDataUseCase(
            expensesRepository,
            revenuesRepository,
            categoriesRepository
        );
    });

    it('should be able to export financial data in CSV format', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });
        const salaryCategory = await categoriesRepository.create({ title: 'Salary' });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            payment_method: 'Credit Card',
            userId: 'user-01',
        });

        await revenuesRepository.create({
            description: 'Monthly salary',
            date: new Date('2023-01-10'),
            value: 5000,
            categoryId: salaryCategory.id,
            income_source: 'Employment',
            userId: 'user-01',
        });

        const { data, filename, contentType } = await sut.execute({
            userId: 'user-01',
            format: 'csv',
            dataType: 'all',
        });

        expect(contentType).toBe('text/csv');
        expect(filename).toContain('spendify_export_all');
        expect(filename).toContain('.csv');
        expect(data).toContain('tipo,descricao,data,valor,categoria');
        expect(data).toContain('"Despesa","Groceries"');
        expect(data).toContain('"Receita","Monthly salary"');
    });

    it('should be able to export financial data in JSON format', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            payment_method: 'Credit Card',
            userId: 'user-01',
        });

        const { data, filename, contentType } = await sut.execute({
            userId: 'user-01',
            format: 'json',
            dataType: 'expenses',
        });

        expect(contentType).toBe('application/json');
        expect(filename).toContain('spendify_export_expenses');
        expect(filename).toContain('.json');

        const parsedData = JSON.parse(data);
        expect(parsedData).toHaveLength(1);
        expect(parsedData[0].tipo).toBe('Despesa');
        expect(parsedData[0].descricao).toBe('Groceries');
        expect(parsedData[0].valor).toBe(500);
        expect(parsedData[0].categoria).toBe('Food');
    });

    it('should filter data by date range', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });

        await expensesRepository.create({
            description: 'Groceries January',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Groceries February',
            date: new Date('2023-02-20'),
            value: 550,
            categoryId: foodCategory.id,
            userId: 'user-01',
        });

        const { data } = await sut.execute({
            userId: 'user-01',
            format: 'json',
            dataType: 'expenses',
            startDate: '2023-02-01',
            endDate: '2023-02-28',
        });

        const parsedData = JSON.parse(data);
        expect(parsedData).toHaveLength(1);
        expect(parsedData[0].descricao).toBe('Groceries February');
    });

    it('should filter data by category', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });
        const transportCategory = await categoriesRepository.create({ title: 'Transport' });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Bus fare',
            date: new Date('2023-01-22'),
            value: 50,
            categoryId: transportCategory.id,
            userId: 'user-01',
        });

        const { data } = await sut.execute({
            userId: 'user-01',
            format: 'json',
            dataType: 'expenses',
            categoryId: transportCategory.id,
        });

        const parsedData = JSON.parse(data);
        expect(parsedData).toHaveLength(1);
        expect(parsedData[0].descricao).toBe('Bus fare');
        expect(parsedData[0].categoria).toBe('Transport');
    });

    it('should only include data from the specified user', async () => {
        const foodCategory = await categoriesRepository.create({ title: 'Food' });

        await expensesRepository.create({
            description: 'Groceries',
            date: new Date('2023-01-20'),
            value: 500,
            categoryId: foodCategory.id,
            userId: 'user-01',
        });

        await expensesRepository.create({
            description: 'Restaurant',
            date: new Date('2023-01-21'),
            value: 200,
            categoryId: foodCategory.id,
            userId: 'user-02',
        });

        const { data } = await sut.execute({
            userId: 'user-01',
            format: 'json',
            dataType: 'expenses',
        });

        const parsedData = JSON.parse(data);
        expect(parsedData).toHaveLength(1);
        expect(parsedData[0].descricao).toBe('Groceries');
    });
}); 