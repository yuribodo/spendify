import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidResetTokenError } from "@/use-cases/errors/invalid-reset-token-error";
import { ExpiredResetTokenError } from "@/use-cases/errors/expired-reset-token-error";
import { makeResetPasswordUseCase } from "@/use-cases/factories/make-reset-password-use-case";

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const resetPasswordBodySchema = z.object({
        token: z.string(),
        password: z.string().min(6),
    });

    const {token, password} = resetPasswordBodySchema.parse(request.body)

    try {
        const resetPasswordUseCase = makeResetPasswordUseCase();

        await resetPasswordUseCase.execute({
            token,
            password,
        });

        return reply.status(200).send({
            message: "password reset succesfully",
        });
    } catch (error) {
        if (error instanceof InvalidResetTokenError) {
            return reply.status(400).send({message: error.message})
        }
        if (error instanceof ExpiredResetTokenError) {
            return reply.status(400).send({message: error.message})
        }
    }
}