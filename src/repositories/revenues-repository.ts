import { Revenue } from "@prisma/client";

export interface CreateRevenueDTO {
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  income_source?: string;
  userId: string;
}

export interface UpdateRevenueDTO {
  id: number;
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  income_source?: string;
  userId: string;
}

export interface FindManyRevenuesParams {
  page: number;
  perPage: number;
  userId: string;
}

export interface FindFilteredRevenuesParams extends FindManyRevenuesParams {
  startDate?: string;
  endDate?: string;
  category?: number;
  income_source?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface FindManyRevenuesResponse {
  revenues: Revenue[];
  totalCount: number;
}

export interface RevenuesRepository {
  create(data: CreateRevenueDTO): Promise<Revenue>;
  update(data: UpdateRevenueDTO): Promise<Revenue>;
  delete(id: number): Promise<void>;
  findMany(params: FindManyRevenuesParams): Promise<FindManyRevenuesResponse>;
  findFiltered(params: FindFilteredRevenuesParams): Promise<FindManyRevenuesResponse>;
  findById(params: { id: number; userId: string | null }): Promise<Revenue | null>;
  findByCategoryId(categoryId: number): Promise<Revenue[]>;
}