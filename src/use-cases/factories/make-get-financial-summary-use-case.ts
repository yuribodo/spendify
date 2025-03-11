import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { GetFinancialSummaryUseCase } from "../reports/get-financial-summary";

export function makeGetFinancialSummaryUseCase() {
    const expensesRepository = new PrismaExpensesRepository();
    const revenuesRepository = new PrismaRevenuesRepository();

    const getFinancialSummaryUseCase = new GetFinancialSummaryUseCase(
        expensesRepository,
        revenuesRepository
    );

    return getFinancialSummaryUseCase;
} 