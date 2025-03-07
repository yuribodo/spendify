import { FastifyInstance } from "fastify";
import { createRevenue } from "../controllers/revenue/create-revenue";
import { getAllRevenues } from "../controllers/revenue/get-all-revenues";

export async function revenueRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createRevenue);
  app.get("/", { preHandler: [app.authenticate] }, getAllRevenues);
}