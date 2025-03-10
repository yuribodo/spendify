import { FastifyInstance } from "fastify";
import { createRevenue } from "../controllers/revenue/create-revenue";
import { getAllRevenues } from "../controllers/revenue/get-all-revenues";
import { filterRevenues } from "../controllers/revenue/filter-revenues";
import { getRevenueDetails } from "../controllers/revenue/get-revenue-details";
import { updateRevenue } from "../controllers/revenue/update-revenue";

export async function revenueRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createRevenue);
  app.get("/", { preHandler: [app.authenticate] }, getAllRevenues);
  app.get("/filtered", { preHandler: [app.authenticate] }, filterRevenues);
  app.get("/:id", { preHandler: [app.authenticate] }, getRevenueDetails);
  app.put("/:id", {preHandler: [app.authenticate]}, updateRevenue)
}