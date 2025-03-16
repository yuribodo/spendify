import { PrismaBudgetRepository } from "../../repositories/prisma/prisma-budget-repository";
import { InAppNotificationService } from "../../services/in-app-notification-service";
import { CheckExpenseThresholdUseCase } from "../budget/check-expense-threshold";

export function makeCheckExpenseThresholdUseCase() {
    const budgetRepository = new PrismaBudgetRepository();
    const notificationService = new InAppNotificationService();

    const useCase = new CheckExpenseThresholdUseCase(budgetRepository, notificationService);

    return useCase;
} 