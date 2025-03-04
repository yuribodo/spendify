import { FastifyInstance } from "fastify";
import { createExpense } from "../controllers/create-expense-controller";
import { getAllExpenses } from "../controllers/get-all-expenses";

export async function expenseRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [app.authenticate] }, createExpense);
  app.get('/', { preHandler: [app.authenticate] }, getAllExpenses);
}