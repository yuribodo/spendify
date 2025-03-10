import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    user: User;
}

export class AuthenticateUseCase {
    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new InvalidCredentialsError();            
        }

        const doesPasswordMatch = await compare(password, user.password_hash);

        if (!doesPasswordMatch) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        };
    }
}