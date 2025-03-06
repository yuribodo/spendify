import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error";
import { makeForgotPasswordUseCase } from "@/use-cases/factories/make-forgot-password-use-case";

export async function forgotPassword(request:FastifyRequest, reply: FastifyReply) {
    const forgotPasswordBodySchema = z.object({
        email: z.string().email()
    });

    const {email} = forgotPasswordBodySchema.parse(request.body)

    try {
        const forgotPasswordUseCase = makeForgotPasswordUseCase()

        const {resetToken} = await forgotPasswordUseCase.execute({
            email,
        });

        // TODO: logic to send email with link having the token

        return reply.status(200).send({
            message: 'Recover E-mail send'
        })
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return reply.status(400).send({message: error.message})
        }

        throw error;
    }
}