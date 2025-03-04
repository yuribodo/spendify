import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { GetExpenseDetailsUseCase } from "../get-expense-details";

export function makeGetExpenseDetailsUseCase() {
  const expensesRepository = new PrismaExpensesRepository();
  const getExpenseDetailsUseCase = new GetExpenseDetailsUseCase(expensesRepository);
  return getExpenseDetailsUseCase;
}