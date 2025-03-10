import { Revenue, Prisma } from "@prisma/client";
import {
  RevenuesRepository,
  CreateRevenueDTO,
  UpdateRevenueDTO,
  FindManyRevenuesParams,
  FindManyRevenuesResponse,
  FindFilteredRevenuesParams,
} from "@/repositories/revenues-repository";

export class InMemoryRevenuesRepository implements RevenuesRepository {
  public items: Revenue[] = [];
  private currentId = 1;

  async create(data: CreateRevenueDTO): Promise<Revenue> {
    const revenue: Revenue = {
      id: this.currentId,
      description: data.description,
      date: data.date,
      value: new Prisma.Decimal(data.value),
      income_source: data.income_source || null,
      categoryId: data.categoryId,
      userId: data.userId,
    };

    this.currentId++;
    this.items.push(revenue);

    return revenue;
  }

  async update(data: UpdateRevenueDTO): Promise<Revenue> {
    const revenueIndex = this.items.findIndex(
      (revenue) => revenue.id === data.id
    );

    if (revenueIndex === -1) {
      throw new Error("Revenue not found");
    }

    const updatedRevenue: Revenue = {
      ...this.items[revenueIndex],
      description: data.description,
      date: data.date,
      value: new Prisma.Decimal(data.value),
      income_source: data.income_source || null,
      categoryId: data.categoryId,
    };

    this.items[revenueIndex] = updatedRevenue;

    return updatedRevenue;
  }

  async delete(id: number): Promise<void> {
    const revenueIndex = this.items.findIndex(
      (revenue) => revenue.id === id
    );

    if (revenueIndex === -1) {
      throw new Error("Revenue not found");
    }

    this.items.splice(revenueIndex, 1);
  }

  async findMany({ page, perPage, userId }: FindManyRevenuesParams): Promise<FindManyRevenuesResponse> {
    const filteredItems = this.items.filter(revenue => revenue.userId === userId);

    const sortedItems = [...filteredItems].sort((a, b) =>
      b.date.getTime() - a.date.getTime()
    );

    const skip = (page - 1) * perPage;
    const paginatedItems = sortedItems.slice(skip, skip + perPage);

    return {
      revenues: paginatedItems,
      totalCount: filteredItems.length,
    };
  }

  async findFiltered({
    page,
    perPage,
    userId,
    startDate,
    endDate,
    category,
    income_source,
    minAmount,
    maxAmount,
  }: FindFilteredRevenuesParams): Promise<FindManyRevenuesResponse> {
    let filteredItems = this.items.filter(revenue => revenue.userId === userId);

    if (startDate || endDate) {
      filteredItems = filteredItems.filter(revenue => {
        const revenueDate = revenue.date;
        if (startDate && new Date(startDate) > revenueDate) return false;
        if (endDate && new Date(endDate) < revenueDate) return false;
        return true;
      });
    }

    if (category !== undefined) {
      filteredItems = filteredItems.filter(revenue => revenue.categoryId === category);
    }

    if (income_source) {
      filteredItems = filteredItems.filter(revenue => revenue.income_source === income_source);
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      filteredItems = filteredItems.filter(revenue => {
        const revenueValue = revenue.value.toNumber();
        if (minAmount !== undefined && revenueValue < minAmount) return false;
        if (maxAmount !== undefined && revenueValue > maxAmount) return false;
        return true;
      });
    }

    const sortedItems = [...filteredItems].sort((a, b) => b.date.getTime() - a.date.getTime());
    const skip = (page - 1) * perPage;
    const paginatedItems = sortedItems.slice(skip, skip + perPage);

    return {
      revenues: paginatedItems,
      totalCount: filteredItems.length,
    };
  }

  async findById({ id, userId }: { id: number; userId: string | null }): Promise<Revenue | null> {
    if (userId === null) {
      const revenue = this.items.find(rev => rev.id === id);
      return revenue || null;
    }
    
    const revenue = this.items.find(rev => rev.id === id && rev.userId === userId);
    return revenue || null;
  }
}