import { PrismaRevenuesRepository } from "@/repositories/prisma/prisma-revenues-repository";
import { GetIncomeBySourceReportUseCase } from "@/use-cases/reports/get-income-by-source-report";

export function makeGetIncomeBySourceReportUseCase() {
    const revenuesRepository = new PrismaRevenuesRepository();

    const getIncomeBySourceReportUseCase = new GetIncomeBySourceReportUseCase(
        revenuesRepository
    );

    return getIncomeBySourceReportUseCase;
} 