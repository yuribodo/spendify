import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { OldRecordError } from "../../errors/old-record-error";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

export async function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: "Validation error",
            issues: error.format(),
        });
    }

    if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: error.message });
    }

    if (error instanceof OldRecordError) {
        return reply.status(403).send({ message: error.message });
    }

    console.error(error);

    return reply.status(500).send({ message: "Internal server error" });
} 