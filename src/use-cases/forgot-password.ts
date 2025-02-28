import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

interface ForgotPasswordUseCaseRequest {
    email: string;
}

interface ForgotPasswordUseCaseResponse {
    user: User;
    resetToken: string;
}

export class ForgotPasswordUseCase {
    async execute({
        email,
    }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        const resetToken = randomBytes(32).toString("hex");
        const resetTokenExpiry = addHours(new Date(), 2);

        const updateUser = await prisma.user.update({
            where: {id: user?.id},
            data: {
                password_reset_token: resetToken,
                password_reset_expires: resetTokenExpiry
            },
        });

        return {
            user: updateUser,
            resetToken
        }
    }
}