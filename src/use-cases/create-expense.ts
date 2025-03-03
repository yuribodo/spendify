import { Expense } from "@prisma/client";
import { ExpensesRepository } from "@/repositories/expenses-repository";

interface CreateExpenseUseCaseRequest {
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  payment_method?: string;
  userId: string;
}

interface CreateExpenseUseCaseResponse {
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
