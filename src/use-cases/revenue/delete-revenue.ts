import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { RevenuesRepository } from "../../repositories/revenues-repository";
import { checkRecordAge } from "../middlewares/check-record-age";

interface DeleteRevenueUseCaseRequest {
    id: string;
    userId: string;
}

export class DeleteRevenueUseCase {
    constructor(private revenueRepository: RevenuesRepository) { }

    async execute({ id, userId }: DeleteRevenueUseCaseRequest) {
        const revenue = await this.revenueRepository.findById({ id: parseInt(id), userId });

        if (!revenue) {
            throw new ResourceNotFoundError();
        }

        if (revenue.userId !== userId) {
            throw new ResourceNotFoundError();
        }

        // Verificar se o registro é mais antigo que 6 meses
        checkRecordAge(revenue.date);

        await this.revenueRepository.delete(parseInt(id));
    }
} 