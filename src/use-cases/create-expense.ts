import { Expense } from "@prisma/client";
import { ExpensesRepository } from "@/repositories/expenses-repository";

export interface CreateExpenseUseCaseRequest {
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  payment_method?: string;
  userId: string;
}

export interface CreateExpenseUseCaseResponse {
  expense: Expense;
}

export class CreateExpenseUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    description,
    date,
    value,
    categoryId,
    payment_method,
    userId,
  }: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {

    if (value < 0) {
      throw new Error('Expense value cannot be negative');
    }

    if (!categoryId) {
      throw new Error('Expense must have a category');
    }

    const expense = await this.expensesRepository.create({
      description,
      date,
      value,
      categoryId,
      payment_method,
      userId,
    });

    return { expense };
  }
}
