import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/in-memory-budget-repository';
import { NotificationService } from '../../../services/notification-service';
import { CheckExpenseThresholdUseCase } from '../../../use-cases/budget/check-expense-threshold';

class InMemoryNotificationService implements NotificationService {
    public notifications: Array<{ userId: string; percentageSpent: number }> = [];

    async sendExpenseThresholdNotification(userId: string, percentageSpent: number): Promise<void> {
        this.notifications.push({ userId, percentageSpent });
    }

    clearAll() {
        this.notifications = [];
    }
}

describe('Check Expense Threshold Use Case', () => {
    let budgetRepository: InMemoryBudgetRepository;
    let notificationService: InMemoryNotificationService;
    let sut: CheckExpenseThresholdUseCase;

    beforeEach(() => {
        budgetRepository = new InMemoryBudgetRepository();
        notificationService = new InMemoryNotificationService();
        sut = new CheckExpenseThresholdUseCase(budgetRepository, notificationService);

        budgetRepository.clearAll();
        notificationService.clearAll();

        vi.clearAllMocks();
    });

    it('should send notification when expenses exceed 80% of revenue', async () => {
        budgetRepository.addRevenue(1000);
        budgetRepository.addExpense(850); // 85% of revenue

        await sut.execute({
            userId: 'user-1',
            year: 2024,
            month: 3,
        });

        expect(notificationService.notifications).toHaveLength(1);
        expect(notificationService.notifications[0].userId).toBe('user-1');
        expect(notificationService.notifications[0].percentageSpent).toBe(85);
    });

    it('should not send notification when expenses are below 80% of revenue', async () => {
        budgetRepository.addRevenue(1000);
        budgetRepository.addExpense(700); // 70% of revenue

        await sut.execute({
            userId: 'user-1',
            year: 2024,
            month: 3,
        });

        expect(notificationService.notifications).toHaveLength(0);
    });

    it('should not send notification when there is no revenue', async () => {
        budgetRepository.addExpense(500);

        await sut.execute({
            userId: 'user-1',
            year: 2024,
            month: 3,
        });

        expect(notificationService.notifications).toHaveLength(0);
    });
}); 