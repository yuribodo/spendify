import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

interface RefreshTokenUseCaseRequest {
    userId: string;
}

interface RefreshTokenUseCaseResponse {
    user: User;
}

export class RefreshTokenUseCase {
    async execute({
        userId,
    }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return {
            user,
        };
    }
}