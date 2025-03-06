import { FastifyInstance } from "fastify";
import { createExpense } from "../controllers/create-expense-controller";
import { updateExpense } from "../controllers/update-expense";
import { getAllExpenses } from "../controllers/get-all-expenses";
import { filterExpenses } from "../controllers/get-filtered-expenses";
import { getExpenseDetails } from "../controllers/get-expense-details";
import { deleteExpense } from "../controllers/delete-expense";

export async function expenseRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createExpense);
  app.put("/:id", { preHandler: [app.authenticate] }, updateExpense);
  app.delete("/:id", { preHandler: [app.authenticate] }, deleteExpense);
  app.get("/", { preHandler: [app.authenticate] }, getAllExpenses);
  app.get("/filtered", { preHandler: [app.authenticate] }, filterExpenses);
  app.get("/:id", { preHandler: [app.authenticate] }, getExpenseDetails);
}