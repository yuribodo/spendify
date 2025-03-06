import { FastifyInstance } from "fastify";
import { authenticate } from "../controllers/auth/authenticate";
import { forgotPassword } from "../controllers/auth/forgot-password";
import { resetPassword } from "../controllers/auth/reset-password";

export async function authRoutes(app: FastifyInstance) {
    app.post('/session', authenticate);
    app.post('/forgot-password', forgotPassword);
    app.post('/reset-password', resetPassword);
}
