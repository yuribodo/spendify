import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { RevenuesRepository } from "@/repositories/revenues-repository";
import { checkRecordAge } from "../middlewares/check-record-age";

interface UpdateRevenueUseCaseRequest {
    id: string;
    userId: string;
    amount?: number;
    source?: string;
    date?: Date;
    description?: string;
}

export class UpdateRevenueUseCase {
    constructor(private revenueRepository: RevenuesRepository) { }

    async execute({
        id,
        userId,
        amount,
        source,
        date,
        description,
    }: UpdateRevenueUseCaseRequest) {
        const revenue = await this.revenueRepository.findById({ id: parseInt(id), userId });

        if (!revenue) {
            throw new ResourceNotFoundError();
        }

        if (revenue.userId !== userId) {
            throw new ResourceNotFoundError();
        }

        checkRecordAge(revenue.date);

        const updatedRevenue = await this.revenueRepository.update({
            id: parseInt(id),
            userId,
            value: amount !== undefined ? amount : Number(revenue.value),
            income_source: source ?? revenue.income_source ?? '',
            date: date || revenue.date,
            description: description || revenue.description,
            categoryId: revenue.categoryId,
        });

        return { revenue: updatedRevenue };
    }
} 