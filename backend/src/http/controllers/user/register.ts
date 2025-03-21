import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/factories/user/make-register-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { username, email, password } = registerBodySchema.parse(request.body)

    try {
        const registerUseCase = makeRegisterUseCase()

        await registerUseCase.execute({
            username,
            email,
            password,
        })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message })
        }

        throw error
    }

    return reply.status(201).send()
}