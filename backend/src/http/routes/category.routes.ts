import { FastifyInstance } from "fastify";
import { createCategory } from "../controllers/category/create-category";
import { deleteCategory } from "../controllers/category/delete-category";
import { getAllCategories } from "../controllers/category/get-all-categories";
import { updateCategory } from "../controllers/category/update-category";

export async function categoryRoutes(app: FastifyInstance) {
  app.post("/", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to create a new category',
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' }
        }
      },
      response: {
        201: {
          description: 'Category successfully created',
          type: 'object',
          properties: {
            category: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' }
              }
            }
          }
        },
        409: {
          description: 'Category already exists',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, createCategory);

  app.get("/", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to list all categories',
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'List of categories',
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, getAllCategories);

  app.put("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to update a category',
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Category successfully updated',
          type: 'object',
          properties: {
            category: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, updateCategory);

  app.delete("/:id", {
    preHandler: [app.authenticate],
    schema: {
      description: 'Route to delete a category',
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Category successfully deleted',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, deleteCategory);
}
