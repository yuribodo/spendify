import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ForgotPasswordUseCase } from "./forgot-password"
import { randomBytes } from "crypto"
import { addHours } from "date-fns"


vi.mock('crypto', async () => {
    const actual = await import('crypto')
    return {
      ...actual,
      randomBytes: vi.fn().mockReturnValue({
        toString: () => 'mocked-reset-token'
      })
    }
  })

vi.mock('date-fns', () => ({
  addHours: vi.fn().mockImplementation(() => new Date(2025, 2, 1, 12, 0, 0))
}))

let usersRepository: InMemoryUsersRepository
let sut: ForgotPasswordUseCase

describe('Forgot Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ForgotPasswordUseCase(usersRepository)
    
    vi.clearAllMocks()
  })
  
  it('should be able to generate a password reset token', async () => {
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456'
    })
    
    const { resetToken } = await sut.execute({
      email: 'johndoe@example.com'
    })
    
    expect(resetToken).toEqual('mocked-reset-token')
  })
  
  it('should not be able to generate a reset token for non-existing user', async () => {
    await expect(() => 
      sut.execute({
        email: 'nonexisting@example.com'
      })
    ).rejects.toThrow()
  })
  
  it('should update the user with the reset token', async () => {
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456'
    })
    
    await sut.execute({
      email: 'johndoe@example.com'
    })
    
    const updatedUser = await usersRepository.findByEmail('johndoe@example.com')
    
    expect(updatedUser?.password_reset_token).toEqual('mocked-reset-token')
  })
  
  it('should update the user with the reset token expiry date', async () => {
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456'
    })
    
    await sut.execute({
      email: 'johndoe@example.com'
    })
    
    const updatedUser = await usersRepository.findByEmail('johndoe@example.com')
    
    expect(updatedUser?.password_reset_expires).toEqual(new Date(2025, 2, 1, 12, 0, 0))
  })
  
  it('should call addHours with current date and 2 hours', async () => {
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456'
    })
    
    await sut.execute({
      email: 'johndoe@example.com'
    })
    
    expect(addHours).toHaveBeenCalledWith(expect.any(Date), 2)
  })
  
  it('should generate a 32 byte random token as hex', async () => {
    await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456'
    })
    
    await sut.execute({
      email: 'johndoe@example.com'
    })
    
    expect(randomBytes).toHaveBeenCalledWith(32)
  })
})