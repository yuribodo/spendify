import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ForgotPasswordUseCase } from "@/use-cases/user/forgot-password";

export function makeForgotPasswordUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const forgotPasswordUseCase = new ForgotPasswordUseCase(usersRepository)
    return forgotPasswordUseCase
}