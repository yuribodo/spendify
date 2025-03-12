import { FastifyInstance } from "fastify";
import { getExpensesByCategoryReport } from "../controllers/reports/get-expenses-by-category-report";
import { getFinancialSummary } from "../controllers/reports/get-financial-summary";
import { getIncomeBySourceReport } from "../controllers/reports/get-income-by-source-report";
import { getMonthlyExpensesReport } from "../controllers/reports/get-monthly-expenses-report";

export async function reportsRoutes(app: FastifyInstance) {
    app.get("/summary", { preHandler: [app.authenticate] }, getFinancialSummary);
    app.get("/monthly-expenses", { preHandler: [app.authenticate] }, getMonthlyExpensesReport);
    app.get("/expenses-by-category", { preHandler: [app.authenticate] }, getExpensesByCategoryReport);
    app.get("/income-by-source", { preHandler: [app.authenticate] }, getIncomeBySourceReport);
} 