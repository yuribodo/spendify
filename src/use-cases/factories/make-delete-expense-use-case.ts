import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { DeleteExpenseUseCase } from "../expense-use-cases/delete-expense";

export function makeDeleteExpenseUseCase() {
    const expensesRepository = new PrismaExpensesRepository();
    const deleteExpenseUseCase = new DeleteExpenseUseCase(expensesRepository);
    return deleteExpenseUseCase;
}