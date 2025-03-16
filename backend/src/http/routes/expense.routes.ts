import { FastifyInstance } from "fastify";
import { createExpense } from "../controllers/expense/create-expense-controller";
import { deleteExpense } from "../controllers/expense/delete-expense";
import { getAllExpenses } from "../controllers/expense/get-all-expenses";
import { getExpenseDetails } from "../controllers/expense/get-expense-details";
import { filterExpenses } from "../controllers/expense/get-filtered-expenses";
import { updateExpense } from "../controllers/expense/update-expense";

export async function expenseRoutes(app: FastifyInstance) {
  app.post("/", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to create a new expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          category: { type: 'string' },
          date: { type: 'string', format: 'date' },
          description: { type: 'string' }
        },
        required: ['amount', 'category', 'date']
      },
      response: {
        201: {
          description: 'Expense successfully created',
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
  }, createExpense);

  app.put("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to update an existing expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          category: { type: 'string' },
          date: { type: 'string', format: 'date' },
          description: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Expense successfully updated',
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
  }, updateExpense);

  app.delete("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to delete an expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      response: {
        204: {
          description: 'Expense successfully deleted'
        }
      }
    }
  }, deleteExpense);

  app.get("/", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to get all expenses',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of all expenses',
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
  }, getAllExpenses);

  app.get("/filtered", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to get filtered expenses',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          category: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'List of filtered expenses',
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
  }, filterExpenses);

  app.get("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to get expense details',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Expense details',
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
  }, getExpenseDetails);
}
