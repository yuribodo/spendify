import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { GetExpensesByCategoryReportUseCase } from "../reports/get-expenses-by-category-report";

export function makeGetExpensesByCategoryReportUseCase() {
    const expensesRepository = new PrismaExpensesRepository();
    const categoriesRepository = new PrismaCategoriesRepository();

    const getExpensesByCategoryReportUseCase = new GetExpensesByCategoryReportUseCase(
        expensesRepository,
        categoriesRepository
    );

    return getExpensesByCategoryReportUseCase;
} 