import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeDeleteRevenueUseCase } from "@/use-cases/factories/make-delete-revenue-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deleteRevenue(request: FastifyRequest, reply: FastifyReply) {
  const deleteRevenueParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = deleteRevenueParamsSchema.parse(request.params);
  const userId = request.user.sub as string;

  try {
    const deleteRevenueUseCase = makeDeleteRevenueUseCase();

    await deleteRevenueUseCase.execute({
      id,
      userId,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Revenue not found.' });
    }

    throw error;
  }
}