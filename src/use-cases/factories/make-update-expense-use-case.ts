import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { UpdateExpenseUseCase } from "../update-expense";

export function makeUpdateExpenseUseCase() {
  const expensesRepository = new PrismaExpensesRepository();
  const updateExpenseUseCase = new UpdateExpenseUseCase(expensesRepository);
  return updateExpenseUseCase;
}