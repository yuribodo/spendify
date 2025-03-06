import { FastifyInstance } from "fastify";
import { createExpense } from "../controllers/expense/create-expense-controller";
import { updateExpense } from "../controllers/expense/update-expense";
import { getAllExpenses } from "../controllers/expense/get-all-expenses";
import { filterExpenses } from "../controllers/expense/get-filtered-expenses";
import { getExpenseDetails } from "../controllers/expense/get-expense-details";
import { deleteExpense } from "../controllers/expense/delete-expense";

export async function expenseRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createExpense);
  app.put("/:id", { preHandler: [app.authenticate] }, updateExpense);
  app.delete("/:id", { preHandler: [app.authenticate] }, deleteExpense);
  app.get("/", { preHandler: [app.authenticate] }, getAllExpenses);
  app.get("/filtered", { preHandler: [app.authenticate] }, filterExpenses);
  app.get("/:id", { preHandler: [app.authenticate] }, getExpenseDetails);
}