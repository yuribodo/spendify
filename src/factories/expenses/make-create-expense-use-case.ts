import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { CreateExpenseUseCase } from "@/use-cases/expenses/create-expense";
import { makeCheckExpenseThresholdUseCase } from "@/use-cases/factories/make-check-expense-threshold-use-case";

export function makeCreateExpenseUseCase() {
  const expensesRepository = new PrismaExpensesRepository();
  const checkExpenseThresholdUseCase = makeCheckExpenseThresholdUseCase();
  const createExpenseUseCase = new CreateExpenseUseCase(
    expensesRepository,
    checkExpenseThresholdUseCase
  );
  return createExpenseUseCase;
}
