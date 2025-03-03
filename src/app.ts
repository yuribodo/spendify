import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { appRoutes } from "./http/routes";
import { env } from "./env/index";
import fastifyJwt from "@fastify/jwt";

export const app = fastify()

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'secret'
})

app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ message: "Token not found or Invalid" });
    }
});

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({message: 'Validation error.', issues: error.format()})
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // TODO: Here i should connect to an external tool like sentry
    }

    return reply.status(500).send({message: 'Internal Server Error'})
})