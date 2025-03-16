import { FastifyInstance } from "fastify";
import { getRemainingBudget } from "../controllers/budget/get-remaining-budget";
export async function budgetRoutes(app: FastifyInstance) {
    app.get("/remaining", {
        preHandler: [app.authenticate],
        schema: {
            description: 'Route to get the remaining budget of the month',
            tags: ['Budget'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    year: { type: 'number' },
                    month: { type: 'number', minimum: 1, maximum: 12 }
                },
                required: ['year', 'month']
            },
            response: {
                200: {
                    description: 'Remaining budget of the month',
                    type: 'object',
                    properties: {
                        budget: {
                            type: 'object',
                            properties: {
                                totalRevenue: { type: 'number' },
                                totalExpenses: { type: 'number' },
                                remainingBudget: { type: 'number' },
                                month: { type: 'number' },
                                year: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    }, getRemainingBudget);
}