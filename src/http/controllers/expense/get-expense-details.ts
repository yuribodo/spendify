import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetExpenseDetailsUseCase } from "@/use-cases/factories/make-get-expense-details-use-case";

export async function getExpenseDetails(request: FastifyRequest, reply: FastifyReply) {
  const getExpenseDetailsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = getExpenseDetailsSchema.parse(request.params);
  const userId = request.user.sub as string;

  const getExpenseDetailsUseCase = makeGetExpenseDetailsUseCase();
  const expense = await getExpenseDetailsUseCase.execute({ id, userId });

  return reply.status(200).send(expense);
}