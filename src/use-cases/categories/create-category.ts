import { Category } from "@prisma/client";
import { CategoriesRepository } from "@/repositories/categories-repository";

interface CreateCategoryUseCaseRequest {
  title: string;
}

interface CreateCategoryUseCaseResponse {
  category: Category;
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    title,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    if (!title.trim()) {
      throw new Error('Category title cannot be empty');
    }

    const categoryWithSameTitle = await this.categoriesRepository.findByTitle(title);

    if (categoryWithSameTitle) {
      throw new Error('Category with same title already exists');
    }

    const category = await this.categoriesRepository.create({
      title,
    });

    return {
      category,
    };
  }
}