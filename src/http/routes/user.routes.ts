import { FastifyInstance } from "fastify";
import { register } from "../controllers/register";
import { updateProfile } from "../controllers/update-user-profile";

export async function userRoutes(app: FastifyInstance) {
    app.post('/', register);
    app.put('/profile', { preHandler: [app.authenticate] }, updateProfile);
}