import { FastifyInstance } from "fastify";
import { createExpense } from "../controllers/create-expense-controller";

export async function expenseRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [app.authenticate] }, createExpense);
}
