import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { ExpensesRepository } from "../../repositories/expenses-repository";
import { checkRecordAge } from "../middlewares/check-record-age";

interface UpdateExpenseUseCaseRequest {
    id: string;
    userId: string;
    amount?: number;
    category?: string;
    date?: Date;
    description?: string;
}

export class UpdateExpenseUseCase {
    constructor(private expenseRepository: ExpensesRepository) { }

    async execute({
        id,
        userId,
        amount,
        category,
        date,
        description,
    }: UpdateExpenseUseCaseRequest) {
        const numericId = parseInt(id);

        const expense = await this.expenseRepository.findById({ id: numericId, userId });

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        if (expense.userId !== userId) {
            throw new ResourceNotFoundError();
        }

        // Verificar se o registro é mais antigo que 6 meses
        checkRecordAge(expense.date);

        const updateData = {
            id: numericId,
            userId,
            value: amount !== undefined ? amount : Number(expense.value),
            categoryId: category ? parseInt(category) : expense.categoryId,
            date: date || expense.date,
            description: description || expense.description,
        };

        const updatedExpense = await this.expenseRepository.update(updateData);

        return { expense: updatedExpense };
    }
} 