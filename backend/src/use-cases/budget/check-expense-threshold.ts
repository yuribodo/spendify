import { BudgetRepository } from "../../repositories/budget-repository";
import { NotificationService } from "../../services/notification-service";

const EXPENSE_THRESHOLD_PERCENTAGE = 80; // 80%

interface CheckExpenseThresholdUseCaseRequest {
    userId: string;
    year: number;
    month: number;
}

export class CheckExpenseThresholdUseCase {
    constructor(
        private budgetRepository: BudgetRepository,
        private notificationService: NotificationService
    ) { }

    async execute({ userId, year, month }: CheckExpenseThresholdUseCaseRequest): Promise<void> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const revenues = await this.budgetRepository.findMonthlyRevenues(
            userId,
            startDate,
            endDate
        );

        const expenses = await this.budgetRepository.findMonthlyExpenses(
            userId,
            startDate,
            endDate
        );

        const totalRevenue = revenues.reduce((acc, revenue) => acc + Number(revenue.value), 0);
        const totalExpenses = expenses.reduce((acc, expense) => acc + Number(expense.value), 0);

        if (totalRevenue > 0) {
            const percentageSpent = (totalExpenses / totalRevenue) * 100;

            if (percentageSpent >= EXPENSE_THRESHOLD_PERCENTAGE) {
                await this.notificationService.sendExpenseThresholdNotification(userId, percentageSpent);
            }
        }
    }
} 