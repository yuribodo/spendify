import { NotificationService } from "./notification-service";

export class InAppNotificationService implements NotificationService {
    // Armazenamento temporário de notificações
    private static notifications: Array<{
        userId: string;
        message: string;
        read: boolean;
        createdAt: Date;
    }> = [];

    async sendExpenseThresholdNotification(userId: string, percentageSpent: number): Promise<void> {
        const message = `Alert: Your expenses this month have reached ${percentageSpent.toFixed(1)}% of your revenue.`;

        // Armazenar notificação em memória em vez de usar Prisma
        InAppNotificationService.notifications.push({
            userId,
            message,
            read: false,
            createdAt: new Date(),
        });

        console.log(`[Notification] ${message} (User: ${userId})`);
    }
} 