import { Expense } from "@prisma/client";

export interface CreateExpenseDTO {
  description: string;
  date: Date;
  value: number;
  categoryId: number;
  payment_method?: string;
  userId: string;
}

export interface ExpensesRepository {
  create(data: CreateExpenseDTO): Promise<Expense>;
}
