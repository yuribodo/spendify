import { Expense } from "@prisma/client";

export interface CreateExpenseDTO {
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  payment_method?: string;
  userId: string;
}

export interface UpdateExpenseDTO {
  id: number;
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  payment_method?: string;
  userId: string;
}

export interface FindManyExpensesParams {
  page: number;
  perPage: number;
  userId: string;
}

export interface FindFilteredExpensesParams extends FindManyExpensesParams {
  startDate?: string;
  endDate?: string;
  category?: number;
  payment_method?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface FindManyExpensesResponse {
  expenses: Expense[];
  totalCount: number;
}

export interface ExpensesRepository {
  create(data: CreateExpenseDTO): Promise<Expense>;
  update(data: UpdateExpenseDTO): Promise<Expense>;
  delete(id: number): Promise<void>;
  findMany(params: FindManyExpensesParams): Promise<FindManyExpensesResponse>;
  findFiltered(params: FindFilteredExpensesParams): Promise<FindManyExpensesResponse>;
  findById(params: { id: number; userId: string | null }): Promise<Expense | null>;
  findByCategoryId(categoryId: number): Promise<Expense[]>;
}