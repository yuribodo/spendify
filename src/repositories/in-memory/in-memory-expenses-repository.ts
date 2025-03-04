import { Expense, Prisma } from "@prisma/client";
import { ExpensesRepository, CreateExpenseDTO, FindManyExpensesParams, FindManyExpensesResponse } from "@/repositories/expenses-repository";

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
}