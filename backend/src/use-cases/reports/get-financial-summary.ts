import { ExpensesRepository } from "@/repositories/expenses-repository";
import { RevenuesRepository } from "@/repositories/revenues-repository";
import { Prisma } from "@prisma/client";

interface GetFinancialSummaryUseCaseRequest {
    userId: string;
    startDate?: string;
    endDate?: string;
}

interface GetFinancialSummaryUseCaseResponse {
    totalIncome: Prisma.Decimal;
    totalExpenses: Prisma.Decimal;
    netBalance: Prisma.Decimal;
}

export class GetFinancialSummaryUseCase {
    constructor(
        private expensesRepository: ExpensesRepository,
        private revenuesRepository: RevenuesRepository
    ) { }

    async execute({
        userId,
        startDate,
        endDate,
    }: GetFinancialSummaryUseCaseRequest): Promise<GetFinancialSummaryUseCaseResponse> {
        const { revenues } = await this.revenuesRepository.findFiltered({
            page: 1,
            perPage: 1000, 
            userId,
            startDate,
            endDate,
        });


        const { expenses } = await this.expensesRepository.findFiltered({
            page: 1,
            perPage: 1000, 
            userId,
            startDate,
            endDate,
        });

        const totalIncome = revenues.reduce(
            (total, revenue) => total.add(revenue.value),
            new Prisma.Decimal(0)
        );

        const totalExpenses = expenses.reduce(
            (total, expense) => total.add(expense.value),
            new Prisma.Decimal(0)
        );

        const netBalance = totalIncome.sub(totalExpenses);

        return {
            totalIncome,
            totalExpenses,
            netBalance,
        };
    }
} 