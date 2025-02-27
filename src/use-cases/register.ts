import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";


interface RegisterUseCaseRequest {
    username: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        username,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6)

        const user = await this.usersRepository.create({
            username,
            email,
            password_hash,
        })

        return {
            user
        }
    }
}