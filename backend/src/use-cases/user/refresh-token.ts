import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { InvalidTokenError } from "@/errors/invalid-token-error";
import { verify } from "jsonwebtoken";

interface RefreshTokenUseCaseRequest {
    token: string;
}

interface RefreshTokenUseCaseResponse {
    user: User;
}

interface TokenPayload {
    sub: string;
}

export class RefreshTokenUseCase {
    async execute({
        token,
    }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
        try {
            const secret = process.env.JWT_SECRET || 'default-secret';
            
            const { sub } = verify(token, secret) as TokenPayload;
            
            const userId = sub;

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (!user) {
                throw new InvalidTokenError();
            }

            return {
                user,
            };
        } catch (error) {
            throw new InvalidTokenError();
        }
    }
}