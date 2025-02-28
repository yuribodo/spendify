import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { InvalidResetTokenError } from "./errors/invalid-reset-token-error";
import { ExpiredResetTokenError } from "./errors/expired-reset-token-error";

interface ResetPasswordUseCaseRequest {
    token: string;
    password: string;
}

export class ResetPasswordUseCase {
    async execute({token, password}: ResetPasswordUseCaseRequest): Promise<void> {
        const user = await prisma.user.findFirst({
            where: {
                password_reset_token: token
            },
        });

        if (!user) {
            throw new InvalidResetTokenError();            
        }

        const tokenExpired = user?.password_reset_expires && user.password_reset_expires < new Date();

        if (tokenExpired) {
            throw new ExpiredResetTokenError();
        }

        const password_hash = await hash(password, 6);

        await prisma.user.update({
            where: {id: user?.id},
            data: {
                password_hash,
                password_reset_token: null,
                password_reset_expires: null,
            },
        });
    }
}