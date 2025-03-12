import { Revenue } from "@prisma/client";
import { RevenuesRepository } from "@/repositories/revenues-repository";

interface GetAllRevenuesUseCaseRequest {
  page: number;
  perPage: number;
  userId: string;
}

interface GetAllRevenuesUseCaseResponse {
  revenues: Revenue[];
  totalCount: number;
}

export class GetAllRevenuesUseCase {
  constructor(private revenuesRepository: RevenuesRepository) {}

  async execute({
    page,
    perPage,
    userId,
  }: GetAllRevenuesUseCaseRequest): Promise<GetAllRevenuesUseCaseResponse> {
    const { revenues, totalCount } = await this.revenuesRepository.findMany({
      page,
      perPage,
      userId,
    });

    return { 
      revenues,
      totalCount,
    };
  }
}