import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import {describe, it, expect, beforeEach} from 'vitest'
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register user Use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async () => {
        const {user} = await sut.execute({
            username: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })


})