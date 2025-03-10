import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { GetAllCategoriesUseCase } from "../categories/get-all-categories";

export function makeGetAllCategoriesUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository();
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoriesRepository);
  return getAllCategoriesUseCase;
}