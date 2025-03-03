import { ExpensesRepository, CreateExpenseDTO } from "../expenses-repository";
import { Expense } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaExpensesRepository implements ExpensesRepository {
  async create(data: CreateExpenseDTO): Promise<Expense> {
    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        date: data.date,
        value: data.value,
        payment_method: data.payment_method,
        categoryId: data.categoryId,
        userId: data.userId,
      },
    });
    return expense;
  }
}
