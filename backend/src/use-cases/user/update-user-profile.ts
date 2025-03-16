import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "../../errors/user-already-exists-error";
import { UserNotFoundError } from "../../errors/user-not-found-error";

interface UpdateProfileUseCaseRequest {
    userId: string;
    username?: string;
    email?: string;
    password?: string;
}

interface UpdateProfileUseCaseResponse {
    user: User;
}

export class UpdateProfileUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({
        userId,
        username,
        email,
        password,
    }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {

        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new UserNotFoundError();
        }


        if (email && email !== user.email) {
            const userWithSameEmail = await this.usersRepository.findByEmail(email);

            if (userWithSameEmail && userWithSameEmail.id !== userId) {
                throw new UserAlreadyExistsError();
            }
        }


        const data: any = {};

        if (username) {
            data.username = username;
        }

        if (email) {
            data.email = email;
        }

        if (password) {
            data.password_hash = await hash(password, 6);
        }

        const updatedUser = await this.usersRepository.update(userId, data);

        return {
            user: updatedUser,
        };
    }
}