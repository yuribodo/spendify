import { Category } from "@prisma/client";
import { CategoriesRepository, CreateCategoryDTO, UpdateCategoryDTO } from "../categories-repository";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [];
  private currentId = 1;

  async create(data: CreateCategoryDTO): Promise<Category> {
    const category = {
      id: this.currentId,
      title: data.title,
    };

    this.currentId++;
    this.items.push(category);

    return category;
  }

  async findByTitle(title: string): Promise<Category | null> {
    const category = this.items.find(item => item.title === title);

    if (!category) {
      return null;
    }

    return category;
  }

  async findById(id: number): Promise<Category | null> {
    const category = this.items.find(item => item.id === id);

    if (!category) {
      return null;
    }

    return category;
  }

  async findMany(): Promise<Category[]> {
    return this.items.sort((a, b) => a.title.localeCompare(b.title));
  }

  async update(id: number, data: UpdateCategoryDTO): Promise<Category> {
    const categoryIndex = this.items.findIndex(item => item.id === id);

    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    const updatedCategory = {
      ...this.items[categoryIndex],
      title: data.title,
    };

    this.items[categoryIndex] = updatedCategory;

    return updatedCategory;
  }
}