import { CategoriesRepository } from "@/repositories/categories-repository";
import { ExpensesRepository } from "@/repositories/expenses-repository";
import { Prisma } from "@prisma/client";

interface CategoryExpense {
    categoryId: number;
    categoryTitle: string;
    total: Prisma.Decimal;
    percentage: number;
}

interface GetExpensesByCategoryReportUseCaseRequest {
    userId: string;
    startDate?: string;
    endDate?: string;
}

interface GetExpensesByCategoryReportUseCaseResponse {
    categoryExpenses: CategoryExpense[];
    totalExpenses: Prisma.Decimal;
}

export class GetExpensesByCategoryReportUseCase {
    constructor(
        private expensesRepository: ExpensesRepository,
        private categoriesRepository: CategoriesRepository
    ) { }

    async execute({
        userId,
        startDate,
        endDate,
    }: GetExpensesByCategoryReportUseCaseRequest): Promise<GetExpensesByCategoryReportUseCaseResponse> {
        const { expenses } = await this.expensesRepository.findFiltered({
            page: 1,
            perPage: 1000,
            userId,
            startDate,
            endDate,
        });

        const categories = await this.categoriesRepository.findMany();

        const categoryExpensesMap = new Map<number, Prisma.Decimal>();

        categories.forEach(category => {
            categoryExpensesMap.set(category.id, new Prisma.Decimal(0));
        });

        expenses.forEach(expense => {
            const currentTotal = categoryExpensesMap.get(expense.categoryId) || new Prisma.Decimal(0);
            categoryExpensesMap.set(expense.categoryId, currentTotal.add(expense.value));
        });

        const totalExpenses = expenses.reduce(
            (total, expense) => total.add(expense.value),
            new Prisma.Decimal(0)
        );

        const categoryExpenses: CategoryExpense[] = [];

        for (const [categoryId, total] of categoryExpensesMap.entries()) {
            if (total.equals(0)) {
                continue;
            }

            const category = categories.find(c => c.id === categoryId);

            if (category) {
                const percentage = totalExpenses.equals(0)
                    ? 0
                    : parseFloat(total.div(totalExpenses).mul(100).toFixed(2));

                categoryExpenses.push({
                    categoryId,
                    categoryTitle: category.title,
                    total,
                    percentage,
                });
            }
        }

        categoryExpenses.sort((a, b) => {
            if (b.total.greaterThan(a.total)) return 1;
            if (b.total.lessThan(a.total)) return -1;
            return 0;
        });

        return {
            categoryExpenses,
            totalExpenses,
        };
    }
} 