import { RevenuesRepository } from "@/repositories/revenues-repository";
import { Revenue } from "@prisma/client";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

interface GetRevenueDetailsUseCaseRequest {
  id: number;
  userId: string;
}

interface GetRevenueDetailsUseCaseResponse {
  revenue: Revenue;
}

export class GetRevenueDetailsUseCase {
  constructor(private revenuesRepository: RevenuesRepository) { }

  async execute({
    id,
    userId,
  }: GetRevenueDetailsUseCaseRequest): Promise<GetRevenueDetailsUseCaseResponse> {
    const revenue = await this.revenuesRepository.findById({
      id,
      userId,
    });

    if (!revenue) {
      throw new ResourceNotFoundError();
    }

    return {
      revenue,
    };
  }
}