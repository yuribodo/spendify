import { FastifyInstance } from "fastify";
import { authenticate } from "../controllers/authenticate";
import { forgotPassword } from "../controllers/forgot-password";
import { resetPassword } from "../controllers/reset-password";

export async function authRoutes(app: FastifyInstance) {
    app.post('/session', authenticate);
    app.post('/forgot-password', forgotPassword);
    app.post('/reset-password', resetPassword);
}
