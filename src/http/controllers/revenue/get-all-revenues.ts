import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetAllRevenuesUseCase } from "@/use-cases/factories/make-get-all-revenues-use-case";

export async function getAllRevenues(request: FastifyRequest, reply: FastifyReply) {
  const getAllRevenuesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).default(10),
  });

  const { page, perPage } = getAllRevenuesQuerySchema.parse(request.query);
  const userId = request.user.sub as string;

  const getAllRevenuesUseCase = makeGetAllRevenuesUseCase();

  const { revenues, totalCount } = await getAllRevenuesUseCase.execute({
    page,
    perPage,
    userId,
  });

  return reply.status(200).send({
    revenues,
    pagination: {
      page,
      perPage,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    },
  });
}