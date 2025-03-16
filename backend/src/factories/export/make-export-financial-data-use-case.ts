import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { ExportFinancialDataUseCase } from "@/use-cases/export/export-financial-data";

export function makeExportFinancialDataUseCase() {
    const expensesRepository = new PrismaExpensesRepository();
    const revenuesRepository = new PrismaRevenuesRepository();
    const categoriesRepository = new PrismaCategoriesRepository();

    const exportFinancialDataUseCase = new ExportFinancialDataUseCase(
        expensesRepository,
        revenuesRepository,
        categoriesRepository
    );

    return exportFinancialDataUseCase;
} 