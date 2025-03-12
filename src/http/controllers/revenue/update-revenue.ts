import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeUpdateRevenueUseCase } from "@/use-cases/factories/make-update-revenue-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateRevenue(request: FastifyRequest, reply: FastifyReply) {
  const updateRevenueParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const updateRevenueBodySchema = z.object({
    description: z.string(),
    date: z.coerce.date(),
    value: z.number(),
    categoryId: z.number(),
    income_source: z.string().optional(),
  });

  const { id } = updateRevenueParamsSchema.parse(request.params);
  const { description, date, value, categoryId, income_source } = updateRevenueBodySchema.parse(request.body);
  const userId = request.user.sub as string;

  try {
    const updateRevenueUseCase = makeUpdateRevenueUseCase();

    const { revenue } = await updateRevenueUseCase.execute({
      id,
      description,
      date,
      value,
      categoryId,
      income_source,
      userId,
    });

    return reply.status(200).send({ revenue });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Revenue not found.' });
    }

    throw error;
  }
}