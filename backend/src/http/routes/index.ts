import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import { categoryRoutes } from "./category.routes";
import { expenseRoutes } from "./expense.routes";
import { exportRoutes } from "./export.routes";
import { reportsRoutes } from "./reports.routes";
import { revenueRoutes } from "./revenue.routes";
import { userRoutes } from "./user.routes";
import { budgetRoutes } from "./budget.routes";

export async function appRoutes(app: FastifyInstance) {
    app.register(userRoutes, { prefix: '/users' });
    app.register(authRoutes, { prefix: '/auth' });
    app.register(expenseRoutes, { prefix: '/expenses' });
    app.register(revenueRoutes, { prefix: '/revenues' });
    app.register(categoryRoutes, { prefix: '/categories' });
    app.register(reportsRoutes, { prefix: '/reports' });
    app.register(exportRoutes, { prefix: '/export' });
    app.register(budgetRoutes, { prefix: '/budget' });
}