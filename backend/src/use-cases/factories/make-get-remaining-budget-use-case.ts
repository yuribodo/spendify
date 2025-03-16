import { PrismaBudgetRepository } from "../../repositories/prisma/prisma-budget-repository";
import { GetRemainingBudgetUseCase } from "../budget/get-remaining-budget";

export function makeGetRemainingBudgetUseCase() {
    const budgetRepository = new PrismaBudgetRepository();
    const useCase = new GetRemainingBudgetUseCase(budgetRepository);

    return useCase;
} 