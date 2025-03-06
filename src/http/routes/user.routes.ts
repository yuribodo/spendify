import { FastifyInstance } from "fastify";
import { register } from "../controllers/user/register";
import { updateProfile } from "../controllers/user/update-user-profile";

export async function userRoutes(app: FastifyInstance) {
    app.post('/', register);
    app.put('/profile', { preHandler: [app.authenticate] }, updateProfile);
}