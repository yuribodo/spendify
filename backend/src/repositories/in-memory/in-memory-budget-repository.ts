import { Prisma } from "@prisma/client";
import { BudgetRepository } from "../budget-repository";

export class InMemoryBudgetRepository implements BudgetRepository {
    private revenues: { value: Prisma.Decimal }[] = [];
    private expenses: { value: Prisma.Decimal }[] = [];

    async findMonthlyRevenues(userId: string, startDate: Date, endDate: Date) {
        return this.revenues;
    }

    async findMonthlyExpenses(userId: string, startDate: Date, endDate: Date) {
        return this.expenses;
    }

    // Métodos auxiliares para teste
    addRevenue(value: number) {
        this.revenues.push({ value: new Prisma.Decimal(value) });
    }

    addExpense(value: number) {
        this.expenses.push({ value: new Prisma.Decimal(value) });
    }

    clearAll() {
        this.revenues = [];
        this.expenses = [];
    }
} 