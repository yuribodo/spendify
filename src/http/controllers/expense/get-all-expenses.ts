import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetAllExpensesUseCase } from "@/factories/expenses/make-get-all-expenses-use-case";

export async function getAllExpenses(request: FastifyRequest, reply: FastifyReply) {
  const getAllExpensesSchema = z.object({
    page: z.coerce.number().default(1),
    perPage: z.coerce.number().default(10),
  });

  const { page, perPage } = getAllExpensesSchema.parse(request.query);
  const userId = request.user.sub as string;

  const getAllExpensesUseCase = makeGetAllExpensesUseCase();
  const { expenses, totalCount } = await getAllExpensesUseCase.execute({
    page,
    perPage,
    userId,
  });

  return reply.status(200).send({
    expenses,
    totalCount,
    page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
  });
}