import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetRemainingBudgetUseCase } from "../../../use-cases/factories/make-get-remaining-budget-use-case";

export async function getRemainingBudget(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const getRemainingBudgetQuerySchema = z.object({
        year: z.string().transform(Number),
        month: z.string().transform(Number),
    });

    const { year, month } = getRemainingBudgetQuerySchema.parse(request.query);

    const getRemainingBudgetUseCase = makeGetRemainingBudgetUseCase();

    const { budget } = await getRemainingBudgetUseCase.execute({
        userId: request.user.sub,
        year,
        month,
    });

    return reply.send({ budget });
} 