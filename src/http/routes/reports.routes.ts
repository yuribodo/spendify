import { FastifyInstance } from "fastify";
import { getFinancialSummary } from "../controllers/reports/get-financial-summary";

export async function reportsRoutes(app: FastifyInstance) {
    app.get("/summary", { preHandler: [app.authenticate] }, getFinancialSummary);
} 