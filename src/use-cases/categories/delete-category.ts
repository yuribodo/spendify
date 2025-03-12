import { CategoriesRepository } from "@/repositories/categories-repository";
import { ExpensesRepository } from "@/repositories/expenses-repository";
import { RevenuesRepository } from "@/repositories/revenues-repository";

interface DeleteCategoryUseCaseRequest {
    id: number;
}

export class DeleteCategoryUseCase {
    constructor(
        private categoriesRepository: CategoriesRepository,
        private expensesRepository: ExpensesRepository,
        private revenuesRepository: RevenuesRepository
    ) { }

    async execute({ id }: DeleteCategoryUseCaseRequest): Promise<void> {
        const category = await this.categoriesRepository.findById(id);

        if (!category) {
            throw new Error('Category not found');
        }

        const expensesWithCategory = await this.expensesRepository.findByCategoryId(id);

        if (expensesWithCategory.length > 0) {
            throw new Error('Cannot delete category that is in use by expenses');
        }

        const revenuesWithCategory = await this.revenuesRepository.findByCategoryId(id);

        if (revenuesWithCategory.length > 0) {
            throw new Error('Cannot delete category that is in use by revenues');
        }

        await this.categoriesRepository.delete(id);
    }
} 