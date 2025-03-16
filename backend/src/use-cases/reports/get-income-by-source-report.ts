import { RevenuesRepository } from "@/repositories/revenues-repository";
import { Prisma } from "@prisma/client";

interface IncomeSource {
    source: string;
    total: Prisma.Decimal;
    percentage: number;
}

interface GetIncomeBySourceReportUseCaseRequest {
    userId: string;
    startDate?: string;
    endDate?: string;
}

interface GetIncomeBySourceReportUseCaseResponse {
    incomeSources: IncomeSource[];
    totalIncome: Prisma.Decimal;
}

export class GetIncomeBySourceReportUseCase {
    constructor(private revenuesRepository: RevenuesRepository) { }

    async execute({
        userId,
        startDate,
        endDate,
    }: GetIncomeBySourceReportUseCaseRequest): Promise<GetIncomeBySourceReportUseCaseResponse> {
        const { revenues } = await this.revenuesRepository.findFiltered({
            page: 1,
            perPage: 1000,
            userId,
            startDate,
            endDate,
        });

        const incomeSourcesMap = new Map<string, Prisma.Decimal>();

        revenues.forEach(revenue => {
            const source = revenue.income_source || 'Não especificado';
            const currentTotal = incomeSourcesMap.get(source) || new Prisma.Decimal(0);
            incomeSourcesMap.set(source, currentTotal.add(revenue.value));
        });

        const totalIncome = revenues.reduce(
            (total, revenue) => total.add(revenue.value),
            new Prisma.Decimal(0)
        );

        const incomeSources: IncomeSource[] = Array.from(incomeSourcesMap.entries()).map(
            ([source, total]) => {
                const percentage = totalIncome.equals(0)
                    ? 0
                    : parseFloat(total.div(totalIncome).mul(100).toFixed(2));

                return {
                    source,
                    total,
                    percentage,
                };
            }
        );

        incomeSources.sort((a, b) => {
            if (b.total.greaterThan(a.total)) return 1;
            if (b.total.lessThan(a.total)) return -1;
            return 0;
        });

        return {
            incomeSources,
            totalIncome,
        };
    }
} 