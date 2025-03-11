import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { UpdateCategoryUseCase } from "../categories/update-category";

export function makeUpdateCategoryUseCase() {
    const categoriesRepository = new PrismaCategoriesRepository();
    const updateCategoryUseCase = new UpdateCategoryUseCase(categoriesRepository);

    return updateCategoryUseCase;
} 