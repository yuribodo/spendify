import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";

export async function appRoutes(app: FastifyInstance) {
    app.register(userRoutes, { prefix: '/users' });
    app.register(authRoutes, { prefix: '/auth' });
}
