import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryBudgetRepository } from '../../../repositories/in-memory/in-memory-budget-repository';
import { GetRemainingBudgetUseCase } from '../../../use-cases/budget/get-remaining-budget';

describe('Get Remaining Budget Use Case', () => {
    let budgetRepository: InMemoryBudgetRepository;
    let sut: GetRemainingBudgetUseCase;

    beforeEach(() => {
        budgetRepository = new InMemoryBudgetRepository();
        sut = new GetRemainingBudgetUseCase(budgetRepository);
        budgetRepository.clearAll();
    });

    it('should calculate remaining budget correctly', async () => {
        budgetRepository.addRevenue(1000);
        budgetRepository.addRevenue(500);
        budgetRepository.addExpense(300);
        budgetRepository.addExpense(400);

        const { budget } = await sut.execute({
            userId: 'user-1',
            year: 2024,
            month: 3,
        });

        expect(budget.totalRevenue).toBe(1500);
        expect(budget.totalExpenses).toBe(700);
        expect(budget.remainingBudget).toBe(800);
    });

    it('should return zero when there are no revenues or expenses', async () => {
        const { budget } = await sut.execute({
            userId: 'user-1',
            year: 2024,
            month: 3,
        });

        expect(budget.totalRevenue).toBe(0);
        expect(budget.totalExpenses).toBe(0);
        expect(budget.remainingBudget).toBe(0);
    });

    it('should return negative budget when expenses are greater than revenues', async () => {
        budgetRepository.addRevenue(500);
        budgetRepository.addExpense(1000);

        const { budget } = await sut.execute({
            userId: 'user-1',
            year: 2024,
            month: 3,
        });

        expect(budget.totalRevenue).toBe(500);
        expect(budget.totalExpenses).toBe(1000);
        expect(budget.remainingBudget).toBe(-500);
    });
}); 