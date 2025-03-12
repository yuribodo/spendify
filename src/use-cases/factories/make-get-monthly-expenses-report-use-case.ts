import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { GetMonthlyExpensesReportUseCase } from "../reports/get-monthly-expenses-report";

export function makeGetMonthlyExpensesReportUseCase() {
    const expensesRepository = new PrismaExpensesRepository();

    const getMonthlyExpensesReportUseCase = new GetMonthlyExpensesReportUseCase(
        expensesRepository
    );

    return getMonthlyExpensesReportUseCase;
} 