import { FastifyInstance } from "fastify";
import { exportFinancialData } from "../controllers/export/export-financial-data";

export async function exportRoutes(app: FastifyInstance) {
    app.get("/financial-data", { preHandler: [app.authenticate] }, exportFinancialData);
} 