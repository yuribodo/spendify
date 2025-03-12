import { RevenuesRepository } from "@/repositories/revenues-repository";
import { Revenue } from "@prisma/client";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

export interface UpdateRevenueUseCaseRequest {
  id: number;
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  income_source?: string;
  userId: string;
}

interface UpdateRevenueUseCaseResponse {
  revenue: Revenue;
}

export class UpdateRevenueUseCase {
  constructor(private revenuesRepository: RevenuesRepository) { }

  async execute({
    id,
    description,
    date,
    value,
    categoryId,
    income_source,
    userId,
  }: UpdateRevenueUseCaseRequest): Promise<UpdateRevenueUseCaseResponse> {

    if (value < 0) {
      throw new Error('Revenue value cannot be negative');
    }


    if (!categoryId) {
      throw new Error('Revenue must have a category');
    }


    const existingRevenue = await this.revenuesRepository.findById({
      id,
      userId: null,
    });

    if (!existingRevenue) {
      throw new ResourceNotFoundError();
    }


    if (existingRevenue.userId !== userId) {
      throw new Error('Not authorized to update this revenue');
    }

    const revenue = await this.revenuesRepository.update({
      id,
      description,
      date,
      value,
      categoryId,
      income_source,
      userId: existingRevenue.userId,
    });

    return {
      revenue,
    };
  }
}