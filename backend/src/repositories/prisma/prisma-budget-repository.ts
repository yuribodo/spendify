import { prisma } from "../../lib/prisma";
import { BudgetRepository } from "../budget-repository";

export class PrismaBudgetRepository implements BudgetRepository {
    async findMonthlyRevenues(userId: string, startDate: Date, endDate: Date) {
        const revenues = await prisma.revenue.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                value: true,
            },
        });

        return revenues;
    }

    async findMonthlyExpenses(userId: string, startDate: Date, endDate: Date) {
        const expenses = await prisma.expense.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                value: true,
            },
        });

        return expenses;
    }
} 