import { makeGetIncomeBySourceReportUseCase } from "@/factories/reports/make-get-income-by-source-report-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getIncomeBySourceReport(request: FastifyRequest, reply: FastifyReply) {
    const getIncomeBySourceReportQuerySchema = z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    });

    const { startDate, endDate } = getIncomeBySourceReportQuerySchema.parse(request.query);

    try {
        const getIncomeBySourceReportUseCase = makeGetIncomeBySourceReportUseCase();

        const { incomeSources, totalIncome } = await getIncomeBySourceReportUseCase.execute({
            userId: request.user.sub,
            startDate,
            endDate,
        });

        return reply.status(200).send({
            incomeSources: incomeSources.map(item => ({
                source: item.source,
                total: item.total.toNumber(),
                percentage: item.percentage,
            })),
            totalIncome: totalIncome.toNumber(),
        });
    } catch (error) {
        throw error;
    }
} 