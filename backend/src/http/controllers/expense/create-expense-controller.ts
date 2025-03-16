import { makeCreateExpenseUseCase } from "@/factories/expenses/make-create-expense-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createExpense(request: FastifyRequest, reply: FastifyReply) {
  const createExpenseSchema = z.object({
    description: z.string(),
    date: z.string(),
    value: z.number(),
    categoryId: z.number(),
    payment_method: z.string().optional(),
  });

  const { description, date, value, categoryId, payment_method } = createExpenseSchema.parse(request.body);
  const expenseDate = new Date(date);
  const userId = request.user.sub as string;

  const createExpenseUseCase = makeCreateExpenseUseCase();
  const { expense } = await createExpenseUseCase.execute({
    description,
    date: expenseDate,
    value,
    categoryId,
    payment_method,
    userId,
  });

  return reply.status(201).send(expense);
}
