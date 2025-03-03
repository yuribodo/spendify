import { User } from "@prisma/client";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { UsersRepository } from "@/repositories/users-repository";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";

interface ForgotPasswordUseCaseRequest {
    email: string;
}

interface ForgotPasswordUseCaseResponse {
    user: User;
    resetToken: string;
}

export class ForgotPasswordUseCase {
    private usersRepository: UsersRepository

    constructor(usersRepository?: UsersRepository) {
        this.usersRepository = usersRepository ?? new PrismaUsersRepository()
    }

    async execute({
        email,
    }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const resetToken = randomBytes(32).toString("hex");
        const resetTokenExpiry = addHours(new Date(), 2);

        user.password_reset_token = resetToken;
        user.password_reset_expires = resetTokenExpiry;



        return {
            user,
            resetToken
        }
    }
}