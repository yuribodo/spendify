import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateRevenueUseCase } from "@/factories/revenues/make-create-revenue-use-case";

export async function createRevenue(request: FastifyRequest, reply: FastifyReply) {
  const createRevenueSchema = z.object({
    description: z.string(),
    date: z.string(), 
    value: z.number(),
    categoryId: z.number(),
    income_source: z.string().optional(),
  });

  const { description, date, value, categoryId, income_source } = createRevenueSchema.parse(request.body);
  const revenueDate = new Date(date);
  const userId = request.user.sub as string;

  const createRevenueUseCase = makeCreateRevenueUseCase();
  const { revenue } = await createRevenueUseCase.execute({
    description,
    date: revenueDate,
    value,
    categoryId,
    income_source,
    userId,
  });

  return reply.status(201).send(revenue);
}