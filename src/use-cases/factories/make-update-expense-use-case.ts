import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { UpdateExpenseUseCase } from "../expense-use-cases/update-expense";

export function makeUpdateExpenseUseCase() {
    const expensesRepository = new PrismaExpensesRepository();
    const updateExpenseUseCase = new UpdateExpenseUseCase(expensesRepository);
    return updateExpenseUseCase;
}