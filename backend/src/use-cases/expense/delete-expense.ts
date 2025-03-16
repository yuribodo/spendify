import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { ExpensesRepository } from "../../repositories/expenses-repository";
import { checkRecordAge } from "../middlewares/check-record-age";

interface DeleteExpenseUseCaseRequest {
    id: string;
    userId: string;
}

export class DeleteExpenseUseCase {
    constructor(private expenseRepository: ExpensesRepository) { }

    async execute({ id, userId }: DeleteExpenseUseCaseRequest) {
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

        await this.expenseRepository.delete(numericId);
    }
} 