import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetRevenueDetailsUseCase } from "@/use-cases/factories/make-get-revenue-details-use-case";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

export async function getRevenueDetails(request: FastifyRequest, reply: FastifyReply) {
  const getRevenueParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = getRevenueParamsSchema.parse(request.params);
  const userId = request.user.sub as string;

  try {
    const getRevenueDetailsUseCase = makeGetRevenueDetailsUseCase();

    const { revenue } = await getRevenueDetailsUseCase.execute({
      id,
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