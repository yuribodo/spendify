import { ExpensesRepository } from "@/repositories/expenses-repository";

export interface DeleteExpenseUseCaseRequest {
  expenseId: number;
  userId: string;
}

export class DeleteExpenseUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    expenseId,
    userId,
  }: DeleteExpenseUseCaseRequest): Promise<void> {
    
    const existingExpense = await this.expensesRepository.findById({
      id: expenseId,
      userId: null
    });

    if (!existingExpense) {
      throw new Error('Expense not found');
    }

    if (existingExpense.userId !== userId) {
      throw new Error('Not authorized to delete this expense');
    }

    await this.expensesRepository.delete(expenseId);
  }
}