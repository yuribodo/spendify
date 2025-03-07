import { FastifyInstance } from "fastify";
import { createRevenue } from "../controllers/revenue/create-revenue";

export async function revenueRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createRevenue);
}