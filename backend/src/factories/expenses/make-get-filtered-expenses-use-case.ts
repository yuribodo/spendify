import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { GetFilteredExpensesUseCase } from "@/use-cases/expenses/get-filtered-expenses";

export function makeGetFilteredExpensesUseCase() {
  const expensesRepository = new PrismaExpensesRepository();
  const getFilteredExpensesUseCase = new GetFilteredExpensesUseCase(expensesRepository);
  return getFilteredExpensesUseCase;
}
