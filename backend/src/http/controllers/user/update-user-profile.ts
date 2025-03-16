import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";
import { UserNotFoundError } from "@/errors/user-not-found-error";
import { makeUpdateProfileUseCase } from "@/factories/user/make-update-user-profile-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const updateProfileBodySchema = z.object({
        userId: z.string().uuid(),
        username: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
    });

    const { userId, username, email, password } = updateProfileBodySchema.parse(request.body);

    try {
        const updateProfileUseCase = makeUpdateProfileUseCase();

        await updateProfileUseCase.execute({
            userId,
            username,
            email,
            password,
        });
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message });
        }

        throw error;
    }

    return reply.status(200).send();
}