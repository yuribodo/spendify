import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { CategoriesRepository, CreateCategoryDTO, UpdateCategoryDTO } from "../categories-repository";

export class PrismaCategoriesRepository implements CategoriesRepository {
  async create(data: CreateCategoryDTO): Promise<Category> {
    const category = await prisma.category.create({
      data: {
        title: data.title,
      },
    });

    return category;
  }

  async findByTitle(title: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        title,
      },
    });

    return category;
  }

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    return category;
  }

  async findMany(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        title: 'asc',
      },
    });

    return categories;
  }

  async update(id: number, data: UpdateCategoryDTO): Promise<Category> {
    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        title: data.title,
      },
    });

    return category;
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({
      where: {
        id,
      },
    });
  }
}