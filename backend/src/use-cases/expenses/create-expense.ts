import { ExpensesRepository } from "@/repositories/expenses-repository";
import { Expense } from "@prisma/client";
import { CheckExpenseThresholdUseCase } from "../budget/check-expense-threshold";

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
  constructor(
    private expensesRepository: ExpensesRepository,
    private checkExpenseThresholdUseCase: CheckExpenseThresholdUseCase
  ) { }

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

    // Verificar se as despesas ultrapassam o limite após a criação
    await this.checkExpenseThresholdUseCase.execute({
      userId,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });

    return { expense };
  }
}
