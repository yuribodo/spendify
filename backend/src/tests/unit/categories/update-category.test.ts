import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { UpdateCategoryUseCase } from '@/use-cases/categories/update-category';
import { beforeEach, describe, expect, it } from 'vitest';

let categoriesRepository: InMemoryCategoriesRepository;
let sut: UpdateCategoryUseCase;

describe('Update Category Use Case', () => {
    beforeEach(() => {
        categoriesRepository = new InMemoryCategoriesRepository();
        sut = new UpdateCategoryUseCase(categoriesRepository);
    });

    it('should be able to update a category', async () => {
        const createdCategory = await categoriesRepository.create({ title: 'Food' });

        const { category } = await sut.execute({
            id: createdCategory.id,
            title: 'Updated Food',
        });

        expect(category.id).toEqual(createdCategory.id);
        expect(category.title).toBe('Updated Food');
    });

    it('should not be able to update a category with empty title', async () => {
        const createdCategory = await categoriesRepository.create({ title: 'Food' });

        await expect(() =>
            sut.execute({
                id: createdCategory.id,
                title: '',
            }),
        ).rejects.toThrow('Category title cannot be empty');
    });

    it('should not be able to update a category with a title that already exists', async () => {
        await categoriesRepository.create({ title: 'Food' });
        const createdCategory = await categoriesRepository.create({ title: 'Health' });

        await expect(() =>
            sut.execute({
                id: createdCategory.id,
                title: 'Food',
            }),
        ).rejects.toThrow('Category with same title already exists');
    });

    it('should be able to update a category with the same title', async () => {
        const createdCategory = await categoriesRepository.create({ title: 'Food' });

        const { category } = await sut.execute({
            id: createdCategory.id,
            title: 'Food',
        });

        expect(category.id).toEqual(createdCategory.id);
        expect(category.title).toBe('Food');
    });

    it('should not be able to update a non-existent category', async () => {
        await expect(() =>
            sut.execute({
                id: 999,
                title: 'Non-existent Category',
            }),
        ).rejects.toThrow('Category not found');
    });
}); 