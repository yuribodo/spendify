import { Category } from "@prisma/client";

export interface CreateCategoryDTO {
  title: string;
}

export interface UpdateCategoryDTO {
  title: string;
}

export interface CategoriesRepository {
  create(data: CreateCategoryDTO): Promise<Category>;
  findByTitle(title: string): Promise<Category | null>;
  findById(id: number): Promise<Category | null>;
  findMany(): Promise<Category[]>;
  update(id: number, data: UpdateCategoryDTO): Promise<Category>;
}