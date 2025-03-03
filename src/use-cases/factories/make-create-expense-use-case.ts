import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { CreateExpenseUseCase } from "../create-expense";

export function makeCreateExpenseUseCase() {
  const expensesRepository = new PrismaExpensesRepository();
  const createExpenseUseCase = new CreateExpenseUseCase(expensesRepository);
  return createExpenseUseCase;
}
