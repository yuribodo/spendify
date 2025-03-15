import { BudgetRepository } from "../../repositories/budget-repository";

interface GetRemainingBudgetUseCaseRequest {
    userId: string;
    year: number;
    month: number;
}

interface GetRemainingBudgetUseCaseResponse {
    budget: {
        totalRevenue: number;
        totalExpenses: number;
        remainingBudget: number;
        month: number;
        year: number;
    };
}

export class GetRemainingBudgetUseCase {
    constructor(private budgetRepository: BudgetRepository) { }

    async execute({
        userId,
        year,
        month,
    }: GetRemainingBudgetUseCaseRequest): Promise<GetRemainingBudgetUseCaseResponse> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const revenues = await this.budgetRepository.findMonthlyRevenues(
            userId,
            startDate,
            endDate,
        );

        const expenses = await this.budgetRepository.findMonthlyExpenses(
            userId,
            startDate,
            endDate,
        );

        const totalRevenue = revenues.reduce((acc, revenue) => acc + Number(revenue.value), 0);
        const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.value), 0);
        const remainingBudget = totalRevenue - totalExpenses;

        return {
            budget: {
                totalRevenue,
                totalExpenses,
                remainingBudget,
                month,
                year,
            },
        };
    }
} 