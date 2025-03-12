import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/user/authenticate'
import { beforeEach, describe, expect, it, vi } from 'vitest'


const mockCompare = vi.fn()
vi.mock('bcryptjs', () => ({
  compare: (password: string, hash: string) => mockCompare(password, hash)
}))

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()


    mockCompare.mockReset()
    mockCompare.mockResolvedValue(true)


    vi.mock('@/lib/prisma', () => {
      return {
        prisma: {
          user: {
            findUnique: vi.fn().mockImplementation(async ({ where }) => {
              return usersRepository.findByEmail(where.email)
            })
          }
        }
      }
    })


    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed-password'
    })

    sut = new AuthenticateUseCase()
  })

  it('should be able to authenticate with valid credentials', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(user.email).toEqual('johndoe@example.com')
    expect(mockCompare).toHaveBeenCalledWith('123456', 'hashed-password')
  })

  it('should not be able to authenticate with non-existing email', async () => {
    await expect(() =>
      sut.execute({
        email: 'nonexisting@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    mockCompare.mockResolvedValueOnce(false)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should call compare with correct parameters', async () => {
    await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(mockCompare).toHaveBeenCalledWith('123456', 'hashed-password')
    expect(mockCompare).toHaveBeenCalledTimes(1)
  })

  it('should return the authenticated user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(result).toHaveProperty('user')
    expect(result.user).toEqual(expect.objectContaining({
      id: expect.any(String),
      username: 'John Doe',
      email: 'johndoe@example.com'
    }))
  })
})