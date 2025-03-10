import { FastifyInstance } from "fastify";
import { createCategory } from "../controllers/category/create-category";

export async function categoryRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createCategory);
}