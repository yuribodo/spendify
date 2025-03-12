import { makeGetMonthlyExpensesReportUseCase } from "@/factories/reports/make-get-monthly-expenses-report-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getMonthlyExpensesReport(request: FastifyRequest, reply: FastifyReply) {
    const getMonthlyExpensesReportQuerySchema = z.object({
        year: z.coerce.number().optional(),
    });

    const { year } = getMonthlyExpensesReportQuerySchema.parse(request.query);

    try {
        const getMonthlyExpensesReportUseCase = makeGetMonthlyExpensesReportUseCase();

        const { monthlyExpenses } = await getMonthlyExpensesReportUseCase.execute({
            userId: request.user.sub,
            year,
        });

        return reply.status(200).send({
            monthlyExpenses: monthlyExpenses.map(item => ({
                month: item.month,
                year: item.year,
                total: item.total.toNumber(),
            })),
        });
    } catch (error) {
        throw error;
    }
} 