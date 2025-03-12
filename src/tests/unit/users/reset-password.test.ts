import { ExpiredResetTokenError } from '@/errors/expired-reset-token-error'
import { InvalidResetTokenError } from '@/errors/invalid-reset-token-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResetPasswordUseCase } from '@/use-cases/user/reset-password'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('bcryptjs', async () => {
  const actual = await import('bcryptjs')
  return {
    ...actual,
    hash: vi.fn().mockResolvedValue('hashed-password')
  }
})

let usersRepository: InMemoryUsersRepository
let sut: ResetPasswordUseCase
let user: any

describe('Reset Password Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()

    vi.spyOn(usersRepository, 'create')
    vi.spyOn(usersRepository, 'findByEmail')
    vi.mock('@/lib/prisma', () => {
      return {
        prisma: {
          user: {
            findFirst: vi.fn().mockImplementation(async ({ where }) => {
              const users = usersRepository.items.filter(
                user => user.password_reset_token === where.password_reset_token
              )
              return users.length > 0 ? users[0] : null
            }),
            update: vi.fn().mockImplementation(async ({ where, data }) => {
              const userIndex = usersRepository.items.findIndex(user => user.id === where.id)
              if (userIndex >= 0) {
                usersRepository.items[userIndex] = {
                  ...usersRepository.items[userIndex],
                  ...data
                }
                return usersRepository.items[userIndex]
              }
              return null
            })
          }
        }
      }
    })

    user = await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      password_reset_token: 'valid-token',
      password_reset_expires: new Date(Date.now() + 1000 * 60 * 60) // expires in 1 hour
    })

    sut = new ResetPasswordUseCase()

    vi.clearAllMocks()
  })

  it('should be able to reset the password with a valid token', async () => {
    await sut.execute({
      token: 'valid-token',
      password: 'new-password'
    })

    const updatedUser = usersRepository.items.find(item => item.id === user.id)

    expect(hash).toHaveBeenCalledWith('new-password', 6)
    expect(updatedUser?.password_hash).toBe('hashed-password')
    expect(updatedUser?.password_reset_token).toBeNull()
    expect(updatedUser?.password_reset_expires).toBeNull()
  })

  it('should not be able to reset the password with an invalid token', async () => {
    await expect(() =>
      sut.execute({
        token: 'invalid-token',
        password: 'new-password'
      })
    ).rejects.toBeInstanceOf(InvalidResetTokenError)
  })

  it('should not be able to reset the password with an expired token', async () => {
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      password_reset_token: 'expired-token',
      password_reset_expires: new Date(Date.now() - 1000 * 60 * 60)
    })

    await expect(() =>
      sut.execute({
        token: 'expired-token',
        password: 'new-password'
      })
    ).rejects.toBeInstanceOf(ExpiredResetTokenError)
  })

  it('should clear the reset token and expiry date after successful password reset', async () => {
    await sut.execute({
      token: 'valid-token',
      password: 'new-password'
    })

    const updatedUser = usersRepository.items.find(item => item.id === user.id)

    expect(updatedUser?.password_reset_token).toBeNull()
    expect(updatedUser?.password_reset_expires).toBeNull()
  })

  it('should hash the new password', async () => {
    await sut.execute({
      token: 'valid-token',
      password: 'new-password'
    })

    expect(hash).toHaveBeenCalledWith('new-password', 6)
  })
})