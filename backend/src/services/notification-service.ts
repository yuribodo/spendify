export interface NotificationService {
    sendExpenseThresholdNotification(userId: string, percentageSpent: number): Promise<void>;
} 