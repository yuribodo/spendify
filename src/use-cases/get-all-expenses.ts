import { Expense } from "@prisma/client";
import { ExpensesRepository } from "@/repositories/expenses-repository";

interface GetAllExpensesUseCaseRequest {
  page: number;
  perPage: number;
  userId: string;
}

interface GetAllExpensesUseCaseResponse {
  expenses: Expense[];
  totalCount: number;
}

export class GetAllExpensesUseCase {
  constructor(private expensesRepository: ExpensesRepository) {}

  async execute({
    page,
    perPage,
    userId,
  }: GetAllExpensesUseCaseRequest): Promise<GetAllExpensesUseCaseResponse> {
    const { expenses, totalCount } = await this.expensesRepository.findMany({
      page,
      perPage,
      userId,
    });

    return { 
      expenses,
      totalCount,
    };
  }
}