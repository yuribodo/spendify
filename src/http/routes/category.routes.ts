import { FastifyInstance } from "fastify";
import { createCategory } from "../controllers/category/create-category";
import { deleteCategory } from "../controllers/category/delete-category";
import { getAllCategories } from "../controllers/category/get-all-categories";
import { updateCategory } from "../controllers/category/update-category";

export async function categoryRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [app.authenticate] }, createCategory);
  app.get("/", { preHandler: [app.authenticate] }, getAllCategories);
  app.put("/:id", { preHandler: [app.authenticate] }, updateCategory);
  app.delete("/:id", { preHandler: [app.authenticate] }, deleteCategory);
}