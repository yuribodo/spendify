import { FastifyInstance } from "fastify";
import { register } from "../controllers/register";

export async function userRoutes(app: FastifyInstance) {
    app.post('/', register); 
}
