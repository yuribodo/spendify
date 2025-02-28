import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";
import { forgotPassword } from "./controllers/forgot-password";
import { resetPassword } from "./controllers/reset-password";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/session', authenticate)
    app.post('/forgot-password', forgotPassword)
    app.post('/reset-password', resetPassword)
}