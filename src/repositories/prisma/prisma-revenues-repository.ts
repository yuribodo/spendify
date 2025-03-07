import { RevenuesRepository, CreateRevenueDTO, UpdateRevenueDTO, FindManyRevenuesParams, FindManyRevenuesResponse, FindFilteredRevenuesParams } from "../revenues-repository";
import { Revenue } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaRevenuesRepository implements RevenuesRepository {
  async create(data: CreateRevenueDTO): Promise<Revenue> {
    const revenue = await prisma.revenue.create({
      data: {
        description: data.description,
        date: data.date,
        value: data.value,
        income_source: data.income_source,
        categoryId: data.categoryId,
        userId: data.userId,
      },
    });
    return revenue;
  }

  async update(data: UpdateRevenueDTO): Promise<Revenue> {
    const revenue = await prisma.revenue.update({
      where: { id: data.id },
      data: {
        description: data.description,
        date: data.date,
        value: data.value,
        income_source: data.income_source,
        categoryId: data.categoryId,
      },
    });
    return revenue;
  }

  async delete(id: number): Promise<void> {
    await prisma.revenue.delete({
      where: { id },
    });
  }

  async findMany({ page, perPage, userId }: FindManyRevenuesParams): Promise<FindManyRevenuesResponse> {
    const skip = (page - 1) * perPage;

    const [revenues, totalCount] = await Promise.all([
      prisma.revenue.findMany({
        where: { userId },
        include: { category: true },
        skip,
        take: perPage,
        orderBy: { date: 'desc' },
      }),
      prisma.revenue.count({ where: { userId } }),
    ]);

    return { revenues, totalCount };
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
    const skip = (page - 1) * perPage;
    const whereClause: any = { userId };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }

    if (category) {
      whereClause.categoryId = category;
    }

    if (income_source) {
      whereClause.income_source = income_source;
    }

    if (minAmount || maxAmount) {
      whereClause.value = {};
      if (minAmount) {
        whereClause.value.gte = minAmount;
      }
      if (maxAmount) {
        whereClause.value.lte = maxAmount;
      }
    }

    const [revenues, totalCount] = await Promise.all([
      prisma.revenue.findMany({
        where: whereClause,
        include: { category: true },
        skip,
        take: perPage,
        orderBy: { date: "desc" },
      }),
      prisma.revenue.count({ where: whereClause }),
    ]);

    return { revenues, totalCount };
  }

  async findById({ id, userId }: { id: number; userId: string | null }): Promise<Revenue | null> {
    // Se userId for null, busca apenas pelo id
    if (userId === null) {
      const revenue = await prisma.revenue.findUnique({
        where: { id },
        include: { category: true },
      });
      return revenue;
    }
    
    // Caso contrário, busca pelo id E userId
    const revenue = await prisma.revenue.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    return revenue;
  }
}