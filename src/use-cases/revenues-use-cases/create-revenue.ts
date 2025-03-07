import { Revenue } from "@prisma/client";
import { RevenuesRepository } from "@/repositories/revenues-repository";

export interface CreateRevenueUseCaseRequest {
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  income_source?: string;
  userId: string;
}

export interface CreateRevenueUseCaseResponse {
  revenue: Revenue;
}

export class CreateRevenueUseCase {
  constructor(private revenuesRepository: RevenuesRepository) {}

  async execute({
    description,
    date,
    value,
    categoryId,
    income_source,
    userId,
  }: CreateRevenueUseCaseRequest): Promise<CreateRevenueUseCaseResponse> {

    if (value < 0) {
      throw new Error('Revenue value cannot be negative');
    }

    if (!categoryId) {
      throw new Error('Revenue must have a category');
    }

    const revenue = await this.revenuesRepository.create({
      description,
      date,
      value,
      categoryId,
      income_source,
      userId,
    });

    return { revenue };
  }
}