import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateProfileUseCase } from "../user-use-cases/update-user-profile";

export function makeUpdateProfileUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const updateProfileUseCase = new UpdateProfileUseCase(usersRepository);

    return updateProfileUseCase;
}