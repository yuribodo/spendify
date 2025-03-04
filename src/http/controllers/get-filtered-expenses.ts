import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetFilteredExpensesUseCase } from "@/use-cases/factories/make-get-filtered-expenses-use-case";

export async function filterExpenses(request: FastifyRequest, reply: FastifyReply) {
  const filterExpensesSchema = z.object({
    page: z.coerce.number().default(1),
    perPage: z.coerce.number().default(10),
    startDate: z.string().optional(),   
    endDate: z.string().optional(),       
    category: z.coerce.number().optional(),
    payment_method: z.string().optional(),
    minAmount: z.coerce.number().optional(),
    maxAmount: z.coerce.number().optional(),
  });

  const {
    page,
    perPage,
    startDate,
    endDate,
    category,
    payment_method,
    minAmount,
    maxAmount,
  } = filterExpensesSchema.parse(request.query);

  const userId = request.user.sub as string;

  const getFilteredExpensesUseCase = makeGetFilteredExpensesUseCase();
  const { expenses, totalCount } = await getFilteredExpensesUseCase.execute({
    page,
    perPage,
    userId,
    startDate,
    endDate,
    category,
    payment_method,
    minAmount,
    maxAmount,
  });

  return reply.status(200).send({
    expenses,
    totalCount,
    page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
  });
}
