import { Expense } from "@prisma/client";
import { ExpensesRepository } from "@/repositories/expenses-repository";

interface GetExpenseDetailsUseCaseRequest {
  id: number;
  userId: string;
}

export class GetExpenseDetailsUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({ id, userId }: GetExpenseDetailsUseCaseRequest): Promise<Expense> {
    const expense = await this.expensesRepository.findById({ id, userId });
    if (!expense) {
      throw new Error("Expense not found");
    }
    return expense;
  }
}
