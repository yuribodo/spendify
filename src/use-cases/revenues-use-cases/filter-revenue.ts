import { Revenue } from "@prisma/client";
import { RevenuesRepository } from "@/repositories/revenues-repository";

interface FilterRevenuesUseCaseRequest {
  page: number;
  perPage: number;
  userId: string;
  startDate?: string;
  endDate?: string;
  category?: number;
  income_source?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface FilterRevenuesUseCaseResponse {
  revenues: Revenue[];
  totalCount: number;
}

export class FilterRevenuesUseCase {
  constructor(private revenuesRepository: RevenuesRepository) {}

  async execute({
    page,
    perPage,
    userId,
    startDate,
    endDate,
    category,
    income_source,
    minAmount,
    maxAmount,
  }: FilterRevenuesUseCaseRequest): Promise<FilterRevenuesUseCaseResponse> {
    const { revenues, totalCount } = await this.revenuesRepository.findFiltered({
      page,
      perPage,
      userId,
      startDate,
      endDate,
      category,
      income_source,
      minAmount,
      maxAmount,
    });

    return { 
      revenues,
      totalCount,
    };
  }
}