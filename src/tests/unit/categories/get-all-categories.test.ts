import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { GetAllCategoriesUseCase } from '@/use-cases/categories/get-all-categories';
import { beforeEach, describe, expect, it } from 'vitest';

let categoriesRepository: InMemoryCategoriesRepository;
let sut: GetAllCategoriesUseCase;

describe('Get All Categories Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new GetAllCategoriesUseCase(categoriesRepository);
  });

  it('should be able to get all categories', async () => {
    await categoriesRepository.create({ title: 'Food' });
    await categoriesRepository.create({ title: 'Drive' });
    await categoriesRepository.create({ title: 'Health' });

    const { categories } = await sut.execute();

    expect(categories).toHaveLength(3);
    expect(categories[0].title).toBe('Drive');
    expect(categories[1].title).toBe('Food');
    expect(categories[2].title).toBe('Health');
  });

  it('should return an empty array if no categories exist', async () => {
    const { categories } = await sut.execute();

    expect(categories).toHaveLength(0);
    expect(categories).toEqual([]);
  });
});