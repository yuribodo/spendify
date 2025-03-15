import { FastifyInstance } from "fastify";
import { createRevenue } from "../controllers/revenue/create-revenue";
import { deleteRevenue } from "../controllers/revenue/delete-revenue";
import { filterRevenues } from "../controllers/revenue/filter-revenues";
import { getAllRevenues } from "../controllers/revenue/get-all-revenues";
import { getRevenueDetails } from "../controllers/revenue/get-revenue-details";
import { updateRevenue } from "../controllers/revenue/update-revenue";

export async function revenueRoutes(app: FastifyInstance) {
  app.post("/", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to create a new revenue',
      tags: ['Revenues'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          source: { type: 'string' },
          date: { type: 'string', format: 'date' },
          description: { type: 'string' }
        },
        required: ['amount', 'source', 'date']
      },
      response: {
        201: {
          description: 'Revenue successfully created',
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            source: { type: 'string' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' }
          }
        }
      }
    }
  }, createRevenue);

  app.get("/", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to get all revenues',
      tags: ['Revenues'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of all revenues',
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
        }
      }
    }
  }, getAllRevenues);

  app.get("/filtered", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to get filtered revenues',
      tags: ['Revenues'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          source: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'List of filtered revenues',
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
        }
      }
    }
  }, filterRevenues);

  app.get("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to get revenue details',
      tags: ['Revenues'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Revenue details',
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            source: { type: 'string' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' }
          }
        }
      }
    }
  }, getRevenueDetails);

  app.put("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to update an existing revenue',
      tags: ['Revenues'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          source: { type: 'string' },
          date: { type: 'string', format: 'date' },
          description: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Revenue successfully updated',
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            source: { type: 'string' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' }
          }
        }
      }
    }
  }, updateRevenue);

  app.delete("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to delete a revenue',
      tags: ['Revenues'],
      security: [{ bearerAuth: [] }],
      response: {
        204: {
          description: 'Revenue successfully deleted'
        }
      }
    }
  }, deleteRevenue);
}
