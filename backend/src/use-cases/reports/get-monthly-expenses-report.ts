import { ExpensesRepository } from "@/repositories/expenses-repository";
import { Prisma } from "@prisma/client";

interface MonthlyExpense {
    month: string;
    year: number;
    total: Prisma.Decimal;
}

interface GetMonthlyExpensesReportUseCaseRequest {
    userId: string;
    year?: number;
}

interface GetMonthlyExpensesReportUseCaseResponse {
    monthlyExpenses: MonthlyExpense[];
}

export class GetMonthlyExpensesReportUseCase {
    constructor(private expensesRepository: ExpensesRepository) { }

    async execute({
        userId,
        year,
    }: GetMonthlyExpensesReportUseCaseRequest): Promise<GetMonthlyExpensesReportUseCaseResponse> {
        const currentYear = year || new Date().getFullYear();


        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const { expenses } = await this.expensesRepository.findFiltered({
            page: 1,
            perPage: 1000,
            userId,
            startDate,
            endDate,
        });


        const monthlyExpensesMap = new Map<string, Prisma.Decimal>();

        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        months.forEach((month, index) => {
            monthlyExpensesMap.set(`${index + 1}`, new Prisma.Decimal(0));
        });

        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const month = (date.getMonth() + 1).toString();

            const currentTotal = monthlyExpensesMap.get(month) || new Prisma.Decimal(0);
            monthlyExpensesMap.set(month, currentTotal.add(expense.value));
        });


        const monthlyExpenses: MonthlyExpense[] = Array.from(monthlyExpensesMap.entries()).map(
            ([monthNumber, total]) => ({
                month: months[parseInt(monthNumber) - 1],
                year: currentYear,
                total,
            })
        );

        monthlyExpenses.sort((a, b) => {
            return months.indexOf(a.month) - months.indexOf(b.month);
        });

        return {
            monthlyExpenses,
        };
    }
} 