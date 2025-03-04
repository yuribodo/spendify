import { Expense } from "@prisma/client";

export interface CreateExpenseDTO {
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

export interface FindManyExpensesResponse {
  expenses: Expense[];
  totalCount: number;
}

export interface ExpensesRepository {
  create(data: CreateExpenseDTO): Promise<Expense>;
  findMany(params: FindManyExpensesParams): Promise<FindManyExpensesResponse>;
}