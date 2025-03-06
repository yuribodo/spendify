import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email, password} = authenticateBodySchema.parse(request.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const {user} = await authenticateUseCase.execute({
            email,
            password,
        });

        const token = await reply.jwtSign(
            {
                role: 'user'
            },
            {
                sign: {
                    sub: user.id,
                },
            }
        )

        return reply.status(200).send({
            token,
        })
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(401).send({message: error.message})
        }
    }
}