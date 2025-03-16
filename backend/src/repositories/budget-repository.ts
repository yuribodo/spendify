import { Prisma } from "@prisma/client";

export interface BudgetRepository {
    findMonthlyRevenues(userId: string, startDate: Date, endDate: Date): Promise<{ value: Prisma.Decimal }[]>;
    findMonthlyExpenses(userId: string, startDate: Date, endDate: Date): Promise<{ value: Prisma.Decimal }[]>;
} 