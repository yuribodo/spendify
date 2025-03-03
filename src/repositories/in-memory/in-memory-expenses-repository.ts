import { Expense, Prisma } from "@prisma/client";
import { ExpensesRepository, CreateExpenseDTO } from "@/repositories/expenses-repository";

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
}
