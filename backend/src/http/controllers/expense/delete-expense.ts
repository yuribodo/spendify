import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDeleteExpenseUseCase } from "@/factories/expenses/make-delete-expense-use-case";

export async function deleteExpense(request: FastifyRequest, reply: FastifyReply) {
  const deleteExpenseParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = deleteExpenseParamsSchema.parse(request.params);
  const userId = request.user.sub as string;

  const deleteExpenseUseCase = makeDeleteExpenseUseCase();
  
  try {
    await deleteExpenseUseCase.execute({
      expenseId: id,
      userId,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Expense not found') {
        return reply.status(404).send({ message: error.message });
      }
      if (error.message === 'Not authorized to delete this expense') {
        return reply.status(403).send({ message: error.message });
      }
    }
    throw error;
  }
}