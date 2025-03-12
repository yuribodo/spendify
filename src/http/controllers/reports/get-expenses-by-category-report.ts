import { makeGetExpensesByCategoryReportUseCase } from "@/use-cases/factories/make-get-expenses-by-category-report-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getExpensesByCategoryReport(request: FastifyRequest, reply: FastifyReply) {
    const getExpensesByCategoryReportQuerySchema = z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    });

    const { startDate, endDate } = getExpensesByCategoryReportQuerySchema.parse(request.query);

    try {
        const getExpensesByCategoryReportUseCase = makeGetExpensesByCategoryReportUseCase();

        const { categoryExpenses, totalExpenses } = await getExpensesByCategoryReportUseCase.execute({
            userId: request.user.sub,
            startDate,
            endDate,
        });

        return reply.status(200).send({
            categoryExpenses: categoryExpenses.map(item => ({
                categoryId: item.categoryId,
                categoryTitle: item.categoryTitle,
                total: item.total.toNumber(),
                percentage: item.percentage,
            })),
            totalExpenses: totalExpenses.toNumber(),
        });
    } catch (error) {
        throw error;
    }
} 