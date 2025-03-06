import { Expense } from "@prisma/client";
import { ExpensesRepository } from "@/repositories/expenses-repository";

export interface UpdateExpenseUseCaseRequest {
  id: number;
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  payment_method?: string;
  userId: string;
}

export interface UpdateExpenseUseCaseResponse {
  expense: Expense;
}

export class UpdateExpenseUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    id,
    description,
    date,
    value,
    categoryId,
    payment_method,
    userId,
  }: UpdateExpenseUseCaseRequest): Promise<UpdateExpenseUseCaseResponse> {
    
    if (value < 0) {
      throw new Error('Expense value cannot be negative');
    }

    if (!categoryId) {
      throw new Error('Expense must have a category');
    }

    const existingExpense = await this.expensesRepository.findById({
      id,
      userId: null 
    });

    if (!existingExpense) {
      throw new Error('Expense not found');
    }

    if (existingExpense.userId !== userId) {
      throw new Error('Not authorized to update this expense');
    }

    const expense = await this.expensesRepository.update({
      id,
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