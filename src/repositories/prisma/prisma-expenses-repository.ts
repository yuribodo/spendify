import { ExpensesRepository, CreateExpenseDTO, FindManyExpensesParams, FindManyExpensesResponse } from "../expenses-repository";
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

  async findMany({ page, perPage, userId }: FindManyExpensesParams): Promise<FindManyExpensesResponse> {
    const skip = (page - 1) * perPage;

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where: {
          userId,
        },
        include: {
          category: true,
        },
        skip,
        take: perPage,
        orderBy: {
          date: 'desc',
        },
      }),
      prisma.expense.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      expenses,
      totalCount,
    };
  }
}