import { Category } from "@prisma/client";
import { CategoriesRepository } from "@/repositories/categories-repository";

interface GetAllCategoriesUseCaseResponse {
  categories: Category[];
}

export class GetAllCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<GetAllCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findMany();

    return {
      categories,
    };
  }
}