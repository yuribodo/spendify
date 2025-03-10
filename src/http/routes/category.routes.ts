import { FastifyInstance } from "fastify";
import { createCategory } from "../controllers/category/create-category";
import { getAllCategories } from "../controllers/category/get-all-categories";

export async function categoryRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createCategory);
  app.get("/", {preHandler: [app.authenticate]}, getAllCategories);
}