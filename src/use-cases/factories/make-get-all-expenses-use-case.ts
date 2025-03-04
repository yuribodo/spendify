import { PrismaExpensesRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { GetAllExpensesUseCase } from "../get-all-expenses";

export function makeGetAllExpensesUseCase() {
  const expensesRepository = new PrismaExpensesRepository();
  const getAllExpensesUseCase = new GetAllExpensesUseCase(expensesRepository);
  return getAllExpensesUseCase;
}