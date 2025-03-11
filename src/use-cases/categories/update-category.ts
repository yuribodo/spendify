import { CategoriesRepository } from "@/repositories/categories-repository";
import { Category } from "@prisma/client";

interface UpdateCategoryUseCaseRequest {
    id: number;
    title: string;
}

interface UpdateCategoryUseCaseResponse {
    category: Category;
}

export class UpdateCategoryUseCase {
    constructor(private categoriesRepository: CategoriesRepository) { }

    async execute({
        id,
        title,
    }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
        if (!title.trim()) {
            throw new Error('Category title cannot be empty');
        }

        const categoryWithSameTitle = await this.categoriesRepository.findByTitle(title);

        if (categoryWithSameTitle && categoryWithSameTitle.id !== id) {
            throw new Error('Category with same title already exists');
        }

        const categoryExists = await this.categoriesRepository.findById(id);

        if (!categoryExists) {
            throw new Error('Category not found');
        }

        const category = await this.categoriesRepository.update(id, {
            title,
        });

        return {
            category,
        };
    }
} 