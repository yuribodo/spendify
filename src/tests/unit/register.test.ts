import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterUseCase } from '@/use-cases/register';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register user Use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            username: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password', async () => {
        const { user } = await sut.execute({
            username: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        })

        const isPasswordHashed = await compare('123456', user.password_hash)

        expect(isPasswordHashed).toBe(true)
    })

    it('should not be able to register with the same email twice', async () => {
        const email = 'john@doe.com'
        
        await sut.execute({
            username: 'John Doe',
            email,
            password: '123456',
        })

        await expect(() => 
            sut.execute({
                username: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})