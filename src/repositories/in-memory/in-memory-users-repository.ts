import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = [];

    async create(data: Prisma.UserCreateInput) {
        const user = {
            id: randomUUID(),
            username: data.username,
            email: data.email,
            password_hash: data.password_hash,
            password_reset_token: data.password_reset_token ?? null,
            password_reset_expires: data.password_reset_expires ? new Date(data.password_reset_expires as any) : null,
            created_at: new Date()
        };

        this.items.push(user);

        return user;
    }

    async findByEmail(email: string) {
        const user = this.items.find((item) => item.email === email);

        if (!user) {
            return null;
        }
        return user;
    }

    async findById(id: string) {
        const user = this.items.find((item) => item.id === id);

        if (!user) {
            return null;
        }
        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        const userIndex = this.items.findIndex((item) => item.id === id);

        if (userIndex === -1) {
            throw new Error('User not found.');
        }

        const user = this.items[userIndex];

        this.items[userIndex] = {
            ...user,
            ...(data.username ? { username: data.username as string } : {}),
            ...(data.email ? { email: data.email as string } : {}),
            ...(data.password_hash ? { password_hash: data.password_hash as string } : {}),
        };

        return this.items[userIndex];
    }
}