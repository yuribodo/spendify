import { FastifyInstance } from "fastify";
import { getExpensesByCategoryReport } from "../controllers/reports/get-expenses-by-category-report";
import { getFinancialSummary } from "../controllers/reports/get-financial-summary";
import { getIncomeBySourceReport } from "../controllers/reports/get-income-by-source-report";
import { getMonthlyExpensesReport } from "../controllers/reports/get-monthly-expenses-report";

export async function reportsRoutes(app: FastifyInstance) {
    app.get("/summary", {
        preHandler: [app.authenticate],
        schema: {
            description: 'Route to get the financial summary',
            tags: ['Reports'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            },
            response: {
                200: {
                    description: 'Financial summary',
                    type: 'object',
                    properties: {
                        summary: {
                            type: 'object',
                            properties: {
                                totalIncome: { type: 'number' },
                                totalExpenses: { type: 'number' },
                                netBalance: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    }, getFinancialSummary);

    app.get("/monthly-expenses", {
        preHandler: [app.authenticate],
        schema: {
            description: 'Route to get the monthly expenses report',
            tags: ['Reports'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    year: { type: 'number' },
                    month: { type: 'number', minimum: 1, maximum: 12 }
                }
            },
            response: {
                200: {
                    description: 'Monthly expenses report',
                    type: 'object',
                    properties: {
                        expenses: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: { type: 'string', format: 'date' },
                                    amount: { type: 'number' },
                                    category: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, getMonthlyExpensesReport);

    app.get("/expenses-by-category", {
        preHandler: [app.authenticate],
        schema: {
            description: 'Route to get the expenses by category report',
            tags: ['Reports'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            },
            response: {
                200: {
                    description: 'Expenses by category report',
                    type: 'object',
                    properties: {
                        categories: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    category: { type: 'string' },
                                    total: { type: 'number' },
                                    percentage: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, getExpensesByCategoryReport);

    app.get("/income-by-source", {
        preHandler: [app.authenticate],
        schema: {
            description: 'Route to get the income by source report',
            tags: ['Reports'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            },
            response: {
                200: {
                    description: 'Income by source report',
                    type: 'object',
                    properties: {
                        sources: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    source: { type: 'string' },
                                    total: { type: 'number' },
                                    percentage: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, getIncomeBySourceReport);
}
