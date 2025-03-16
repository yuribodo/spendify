import { RevenuesRepository } from "@/repositories/revenues-repository";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

interface DeleteRevenueUseCaseRequest {
  id: number;
  userId: string;
}

export class DeleteRevenueUseCase {
  constructor(private revenuesRepository: RevenuesRepository) { }

  async execute({ id, userId }: DeleteRevenueUseCaseRequest): Promise<void> {
    const existingRevenue = await this.revenuesRepository.findById({
      id,
      userId: null,
    });

    if (!existingRevenue) {
      throw new ResourceNotFoundError();
    }

    if (existingRevenue.userId !== userId) {
      throw new Error('Not authorized to delete this revenue');
    }

    await this.revenuesRepository.delete(id);
  }
}