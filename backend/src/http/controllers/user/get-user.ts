import { UserNotFoundError } from "@/errors/user-not-found-error";
import { makeGetUserProfileUseCase } from "@/factories/user/make-getuser-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const getUserProfileParamsSchema = z.object({
        userId: z.string().uuid(),
    });

    const { userId } = getUserProfileParamsSchema.parse(request.params);

    try {
        const getUserProfileUseCase = makeGetUserProfileUseCase();

        const { user } = await getUserProfileUseCase.execute({
            userId,
        });

        return reply.status(200).send({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        throw error;
    }
}