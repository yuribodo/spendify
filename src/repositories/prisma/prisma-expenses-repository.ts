import { prisma } from "@/lib/prisma";
import { Expense } from "@prisma/client";
import { CreateExpenseDTO, ExpensesRepository, FindFilteredExpensesParams, FindManyExpensesParams, FindManyExpensesResponse, UpdateExpenseDTO } from "../expenses-repository";

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

  async update(data: UpdateExpenseDTO): Promise<Expense> {
    const expense = await prisma.expense.update({
      where: { id: data.id },
      data: {
        description: data.description,
        date: data.date,
        value: data.value,
        payment_method: data.payment_method,
        categoryId: data.categoryId,
      },
    });
    return expense;
  }

  async delete(id: number): Promise<void> {
    await prisma.expense.delete({
      where: { id },
    });
  }

  async findMany({ page, perPage, userId }: FindManyExpensesParams): Promise<FindManyExpensesResponse> {
    const skip = (page - 1) * perPage;

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        skip,
        take: perPage,
        orderBy: { date: 'desc' },
      }),
      prisma.expense.count({ where: { userId } }),
    ]);

    return { expenses, totalCount };
  }

  async findFiltered({
    page,
    perPage,
    userId,
    startDate,
    endDate,
    category,
    payment_method,
    minAmount,
    maxAmount,
  }: FindFilteredExpensesParams): Promise<FindManyExpensesResponse> {
    const skip = (page - 1) * perPage;
    const whereClause: any = { userId };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    if (category) {
      whereClause.categoryId = category;
    }

    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    if (minAmount || maxAmount) {
      whereClause.value = {};
      if (minAmount) {
        whereClause.value.gte = minAmount;
      }
      if (maxAmount) {
        whereClause.value.lte = maxAmount;
      }
    }

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where: whereClause,
        include: { category: true },
        skip,
        take: perPage,
        orderBy: { date: "desc" },
      }),
      prisma.expense.count({ where: whereClause }),
    ]);

    return { expenses, totalCount };
  }

  async findById(params: { id: number; userId: string | null }): Promise<Expense | null> {
    const { id, userId } = params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        ...(userId ? { userId } : {}),
      },
    });

    return expense;
  }

  async findByCategoryId(categoryId: number): Promise<Expense[]> {
    const expenses = await prisma.expense.findMany({
      where: {
        categoryId,
      },
    });

    return expenses;
  }
}