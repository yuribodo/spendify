import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { DeleteCategoryUseCase } from "../categories/delete-category";

export function makeDeleteCategoryUseCase() {
    const categoriesRepository = new PrismaCategoriesRepository();
    const expensesRepository = new PrismaExpensesRepository();
    const revenuesRepository = new PrismaRevenuesRepository();

    const deleteCategoryUseCase = new DeleteCategoryUseCase(
        categoriesRepository,
        expensesRepository,
        revenuesRepository
    );

    return deleteCategoryUseCase;
} 