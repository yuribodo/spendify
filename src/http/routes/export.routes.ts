import { FastifyInstance } from "fastify";
import { exportFinancialData } from "../controllers/export/export-financial-data";

export async function exportRoutes(app: FastifyInstance) {
    app.get("/financial-data", {
        preHandler: [app.authenticate],
        schema: {
            description: 'Route to export financial data',
            tags: ['Export'],
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
                    description: 'Financial data successfully exported',
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                revenues: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            amount: { type: 'number' },
                                            source: { type: 'string' },
                                            date: { type: 'string', format: 'date' },
                                            description: { type: 'string' }
                                        }
                                    }
                                },
                                expenses: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            amount: { type: 'number' },
                                            category: { type: 'string' },
                                            date: { type: 'string', format: 'date' },
                                            description: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, exportFinancialData);
}
