import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { CreateCategoryUseCase } from '@/use-cases/categories/create-category';
import { beforeEach, describe, expect, it } from 'vitest';

let categoriesRepository: InMemoryCategoriesRepository;
let sut: CreateCategoryUseCase;

describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryUseCase(categoriesRepository);
  });

  it('should be able to create a category', async () => {
    const { category } = await sut.execute({
      title: 'Alimentação',
    });

    expect(category.id).toEqual(1);
    expect(category.title).toBe('Alimentação');
  });

  it('should not allow creating a category with empty title', async () => {
    await expect(
      sut.execute({
        title: '   ',
      })
    ).rejects.toThrow('Category title cannot be empty');
  });

  it('should not allow creating a category with the same title', async () => {
    await sut.execute({
      title: 'Alimentação',
    });

    await expect(
      sut.execute({
        title: 'Alimentação',
      })
    ).rejects.toThrow('Category with same title already exists');
  });
});