import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateProfileUseCase } from "@/use-cases/user/update-user-profile";

export function makeUpdateProfileUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const updateProfileUseCase = new UpdateProfileUseCase(usersRepository);

    return updateProfileUseCase;
}