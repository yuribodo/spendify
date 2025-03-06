import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateProfileUseCase } from '@/use-cases/user-use-cases/update-user-profile'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

const mockHash = vi.fn()
vi.mock('bcryptjs', () => ({
  hash: (password: string, salt: number) => mockHash(password, salt)
}))

let usersRepository: InMemoryUsersRepository
let sut: UpdateProfileUseCase

describe('Update Profile Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateProfileUseCase(usersRepository)

    mockHash.mockReset()
    mockHash.mockResolvedValue('new-hashed-password')

    vi.mock('@/lib/prisma', () => {
      return {
        prisma: {
          user: {
            findUnique: vi.fn().mockImplementation(async ({ where }) => {
              if (where.id) {
                return usersRepository.findById(where.id)
              }
              if (where.email) {
                return usersRepository.findByEmail(where.email)
              }
              return null
            }),
            update: vi.fn().mockImplementation(async ({ where, data }) => {
              return usersRepository.update(where.id, data)
            })
          }
        }
      }
    })

    // Create a test user
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed-password'
    })
  })

  it('should be able to update username', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    const { user } = await sut.execute({
      userId: existingUser!.id,
      username: 'New Name'
    })

    expect(user.username).toEqual('New Name')
    expect(user.email).toEqual('johndoe@example.com')
    expect(user.password_hash).toEqual('hashed-password')
  })

  it('should be able to update email', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    const { user } = await sut.execute({
      userId: existingUser!.id,
      email: 'newemail@example.com'
    })

    expect(user.username).toEqual('John Doe')
    expect(user.email).toEqual('newemail@example.com')
    expect(user.password_hash).toEqual('hashed-password')
  })

  it('should be able to update password', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    const { user } = await sut.execute({
      userId: existingUser!.id,
      password: 'newpassword'
    })

    expect(user.username).toEqual('John Doe')
    expect(user.email).toEqual('johndoe@example.com')
    expect(user.password_hash).toEqual('new-hashed-password')
    expect(mockHash).toHaveBeenCalledWith('newpassword', 6)
  })

  it('should be able to update multiple fields simultaneously', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    const { user } = await sut.execute({
      userId: existingUser!.id,
      username: 'New Name',
      email: 'newemail@example.com',
      password: 'newpassword'
    })

    expect(user.username).toEqual('New Name')
    expect(user.email).toEqual('newemail@example.com')
    expect(user.password_hash).toEqual('new-hashed-password')
    expect(mockHash).toHaveBeenCalledWith('newpassword', 6)
  })

  it('should not be able to update with non-existing userId', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        username: 'New Name'
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to update to an email that is already in use by another user', async () => {
    // Create another user with a different email
    await usersRepository.create({
      username: 'Another User',
      email: 'another@example.com',
      password_hash: 'another-hashed-password'
    })

    // Try to update the first user's email to another user's email
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    await expect(() =>
      sut.execute({
        userId: existingUser!.id,
        email: 'another@example.com'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to update to the same email', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    const { user } = await sut.execute({
      userId: existingUser!.id,
      email: 'johndoe@example.com'
    })

    expect(user.email).toEqual('johndoe@example.com')
  })

  it('should call hash with correct parameters when updating password', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    await sut.execute({
      userId: existingUser!.id,
      password: 'newpassword'
    })

    expect(mockHash).toHaveBeenCalledWith('newpassword', 6)
    expect(mockHash).toHaveBeenCalledTimes(1)
  })

  it('should not call hash when not updating password', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    await sut.execute({
      userId: existingUser!.id,
      username: 'New Name'
    })

    expect(mockHash).not.toHaveBeenCalled()
  })

  it('should return the updated user', async () => {
    const existingUser = await usersRepository.findByEmail('johndoe@example.com')

    const result = await sut.execute({
      userId: existingUser!.id,
      username: 'New Name'
    })

    expect(result).toHaveProperty('user')
    expect(result.user).toEqual(expect.objectContaining({
      id: existingUser!.id,
      username: 'New Name',
      email: 'johndoe@example.com'
    }))
  })
})