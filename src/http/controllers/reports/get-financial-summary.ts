import { makeGetFinancialSummaryUseCase } from "@/factories/reports/make-get-financial-summary-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getFinancialSummary(request: FastifyRequest, reply: FastifyReply) {
    const getFinancialSummaryQuerySchema = z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    });

    const { startDate, endDate } = getFinancialSummaryQuerySchema.parse(request.query);

    try {
        const getFinancialSummaryUseCase = makeGetFinancialSummaryUseCase();

        const { totalIncome, totalExpenses, netBalance } = await getFinancialSummaryUseCase.execute({
            userId: request.user.sub,
            startDate,
            endDate,
        });

        return reply.status(200).send({
            summary: {
                totalIncome: totalIncome.toNumber(),
                totalExpenses: totalExpenses.toNumber(),
                netBalance: netBalance.toNumber(),
            }
        });
    } catch (error) {
        throw error;
    }
} 