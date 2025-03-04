import { ExpensesRepository } from "@/repositories/expenses-repository";

interface GetFilteredExpensesUseCaseRequest {
    page: number;
    perPage: number;
    userId: string;
    startDate?: string;
    endDate?: string;
    category?: number;
    payment_method?: string;
    minAmount?: number;
    maxAmount?: number;
  }
  
  export class GetFilteredExpensesUseCase {
    constructor(private expensesRepository: ExpensesRepository) {}
  
    async execute({
      page,
      perPage,
      userId,
      startDate,
      endDate,
      category,
      payment_method,
      minAmount,
      maxAmount,
    }: GetFilteredExpensesUseCaseRequest) {
      const { expenses, totalCount } = await this.expensesRepository.findFiltered({
        page,
        perPage,
        userId,
        startDate,
        endDate,
        category,
        payment_method,
        minAmount,
        maxAmount,
      });
  
      return { expenses, totalCount };
    }
  }
  