import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFilterRevenuesUseCase } from "@/factories/revenues/make-filter-revenue-use-case";

export async function filterRevenues(request: FastifyRequest, reply: FastifyReply) {
  const filterRevenuesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).default(10),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    category: z.coerce.number().optional(),
    income_source: z.string().optional(),
    minAmount: z.coerce.number().optional(),
    maxAmount: z.coerce.number().optional(),
  });

  const { 
    page, 
    perPage, 
    startDate, 
    endDate, 
    category, 
    income_source, 
    minAmount, 
    maxAmount 
  } = filterRevenuesQuerySchema.parse(request.query);
  
  const userId = request.user.sub as string;

  const filterRevenuesUseCase = makeFilterRevenuesUseCase();

  const { revenues, totalCount } = await filterRevenuesUseCase.execute({
    page,
    perPage,
    userId,
    startDate,
    endDate,
    category,
    income_source,
    minAmount,
    maxAmount,
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