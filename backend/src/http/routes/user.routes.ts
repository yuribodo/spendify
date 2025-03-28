import { FastifyInstance } from "fastify";
import { register } from "../controllers/user/register";
import { updateProfile } from "../controllers/user/update-user-profile";
import { getUserProfile } from "../controllers/user/get-user";

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        description: "Route to register a new user",
        tags: ["Users"],
        body: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          201: {
            description: "User successfully created",
            type: "object",
          },
          409: {
            description: "User already exists",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    register
  );

  app.put(
    "/profile",
    {
      schema: {
        description: "Route to update user profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          200: {
            description: "Profile successfully updated",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      preHandler: [app.authenticate],
    },
    updateProfile
  );

  app.get(
    "/:userId",
    {
      schema: {
        description: "Get user profile",
        tags: ["Users"],
        params: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            description: "User profile successfully retrieved",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    getUserProfile
  );
}
