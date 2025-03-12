import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository';
import { InMemoryRevenuesRepository } from '@/repositories/in-memory/in-memory-revenues-repository';
import { DeleteCategoryUseCase } from '@/use-cases/categories/delete-category';
import { beforeEach, describe, expect, it } from 'vitest';

let categoriesRepository: InMemoryCategoriesRepository;
let expensesRepository: InMemoryExpensesRepository;
let revenuesRepository: InMemoryRevenuesRepository;
let sut: DeleteCategoryUseCase;

describe('Delete Category Use Case', () => {
    beforeEach(() => {
        categoriesRepository = new InMemoryCategoriesRepository();
        expensesRepository = new InMemoryExpensesRepository();
        revenuesRepository = new InMemoryRevenuesRepository();
        sut = new DeleteCategoryUseCase(
            categoriesRepository,
            expensesRepository,
            revenuesRepository
        );
    });

    it('should be able to delete a category', async () => {
        const category = await categoriesRepository.create({ title: 'Food' });

        await sut.execute({
            id: category.id,
        });

        expect(categoriesRepository.items).toHaveLength(0);
    });

    it('should not be able to delete a non-existent category', async () => {
        await expect(() =>
            sut.execute({
                id: 999,
            }),
        ).rejects.toThrow('Category not found');
    });

    it('should not be able to delete a category that is in use by expenses', async () => {
        const category = await categoriesRepository.create({ title: 'Food' });

        await expensesRepository.create({
            description: 'Lunch',
            date: new Date(),
            value: 50,
            categoryId: category.id,
            userId: 'user-01',
        });

        await expect(() =>
            sut.execute({
                id: category.id,
            }),
        ).rejects.toThrow('Cannot delete category that is in use by expenses');
    });

    it('should not be able to delete a category that is in use by revenues', async () => {
        const category = await categoriesRepository.create({ title: 'Salary' });

        await revenuesRepository.create({
            description: 'Monthly salary',
            date: new Date(),
            value: 5000,
            categoryId: category.id,
            userId: 'user-01',
        });

        await expect(() =>
            sut.execute({
                id: category.id,
            }),
        ).rejects.toThrow('Cannot delete category that is in use by revenues');
    });
}); 