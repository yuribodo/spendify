import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateExpenseUseCase } from "@/use-cases/factories/make-update-expense-use-case";

export async function updateExpense(request: FastifyRequest, reply: FastifyReply) {
  const updateExpenseParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const updateExpenseBodySchema = z.object({
    description: z.string(),
    date: z.string(),
    value: z.number(),
    categoryId: z.number(),
    payment_method: z.string().optional(),
  });

  const { id } = updateExpenseParamsSchema.parse(request.params);
  const { description, date, value, categoryId, payment_method } = updateExpenseBodySchema.parse(request.body);
  
  const expenseDate = new Date(date);
  const userId = request.user.sub as string;

  const updateExpenseUseCase = makeUpdateExpenseUseCase();
  
  try {
    const { expense } = await updateExpenseUseCase.execute({
      id,
      description,
      date: expenseDate,
      value,
      categoryId,
      payment_method,
      userId,
    });

    return reply.status(200).send(expense);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Expense not found') {
        return reply.status(404).send({ message: error.message });
      }
      if (error.message === 'Not authorized to update this expense') {
        return reply.status(403).send({ message: error.message });
      }
    }
    throw error;
  }
}