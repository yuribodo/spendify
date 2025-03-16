import {
  CreateExpenseDTO,
  ExpensesRepository,
  FindFilteredExpensesParams,
  FindManyExpensesParams,
  FindManyExpensesResponse,
  UpdateExpenseDTO,
} from "@/repositories/expenses-repository";
import { Expense, Prisma } from "@prisma/client";

export class InMemoryExpensesRepository implements ExpensesRepository {
  public items: Expense[] = [];
  private currentId = 1;

  async create(data: CreateExpenseDTO): Promise<Expense> {
    const expense: Expense = {
      id: this.currentId,
      description: data.description,
      date: data.date,
      value: new Prisma.Decimal(data.value),
      payment_method: data.payment_method || null,
      categoryId: data.categoryId,
      userId: data.userId,
    };

    this.currentId++;
    this.items.push(expense);

    return expense;
  }

  async update(data: UpdateExpenseDTO): Promise<Expense> {
    const expenseIndex = this.items.findIndex(
      (expense) => expense.id === data.id
    );

    if (expenseIndex === -1) {
      throw new Error("Expense not found");
    }

    const updatedExpense: Expense = {
      ...this.items[expenseIndex],
      description: data.description,
      date: data.date,
      value: new Prisma.Decimal(data.value),
      payment_method: data.payment_method || null,
      categoryId: data.categoryId,
    };

    this.items[expenseIndex] = updatedExpense;

    return updatedExpense;
  }

  async delete(id: number): Promise<void> {
    const expenseIndex = this.items.findIndex(
      (expense) => expense.id === id
    );

    if (expenseIndex === -1) {
      throw new Error("Expense not found");
    }

    this.items.splice(expenseIndex, 1);
  }

  async findMany({ page, perPage, userId }: FindManyExpensesParams): Promise<FindManyExpensesResponse> {
    const filteredItems = this.items.filter(expense => expense.userId === userId);

    const sortedItems = [...filteredItems].sort((a, b) =>
      b.date.getTime() - a.date.getTime()
    );

    const skip = (page - 1) * perPage;
    const paginatedItems = sortedItems.slice(skip, skip + perPage);

    return {
      expenses: paginatedItems,
      totalCount: filteredItems.length,
    };
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
    let filteredItems = this.items.filter(expense => expense.userId === userId);

    if (startDate || endDate) {
      filteredItems = filteredItems.filter(expense => {
        const expenseDate = expense.date;
        if (startDate && new Date(startDate) > expenseDate) return false;
        if (endDate && new Date(endDate) < expenseDate) return false;
        return true;
      });
    }

    if (category !== undefined) {
      filteredItems = filteredItems.filter(expense => expense.categoryId === category);
    }

    if (payment_method) {
      filteredItems = filteredItems.filter(expense => expense.payment_method === payment_method);
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      filteredItems = filteredItems.filter(expense => {
        const expenseValue = expense.value.toNumber();
        if (minAmount !== undefined && expenseValue < minAmount) return false;
        if (maxAmount !== undefined && expenseValue > maxAmount) return false;
        return true;
      });
    }

    const sortedItems = [...filteredItems].sort((a, b) => b.date.getTime() - a.date.getTime());
    const skip = (page - 1) * perPage;
    const paginatedItems = sortedItems.slice(skip, skip + perPage);

    return {
      expenses: paginatedItems,
      totalCount: filteredItems.length,
    };
  }

  async findById(params: { id: number; userId: string | null }): Promise<Expense | null> {
    const { id, userId } = params;

    const expense = this.items.find((item) => {
      if (userId === null) {
        return item.id === id;
      }
      return item.id === id && item.userId === userId;
    });

    if (!expense) {
      return null;
    }

    return expense;
  }

  async findByCategoryId(categoryId: number): Promise<Expense[]> {
    const expenses = this.items.filter(item => item.categoryId === categoryId);

    return expenses;
  }
}