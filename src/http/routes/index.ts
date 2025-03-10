import { FastifyInstance } from "fastify";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { expenseRoutes } from "./expense.routes";
import { revenueRoutes } from "./revenue.routes";
import { categoryRoutes } from "./category.routes";

export async function appRoutes(app: FastifyInstance) {
    app.register(userRoutes, { prefix: '/users' });
    app.register(authRoutes, { prefix: '/auth' });
    app.register(expenseRoutes, { prefix: '/expenses' });
    app.register(revenueRoutes, { prefix: '/revenues' });
    app.register(categoryRoutes, { prefix: '/categories' });
}
