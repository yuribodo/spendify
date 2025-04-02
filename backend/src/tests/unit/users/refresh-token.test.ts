import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RefreshTokenUseCase } from '@/use-cases/user/refresh-token';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let usersRepository: InMemoryUsersRepository;
let sut: RefreshTokenUseCase;
let userId: string;

describe('Refresh Token Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    
    // Mock prisma
    vi.mock('@/lib/prisma', () => {
      return {
        prisma: {
          user: {
            findUnique: vi.fn().mockImplementation(async ({ where }) => {
              return usersRepository.findById(where.id);
            })
          }
        }
      };
    });

    // Create a test user
    const user = await usersRepository.create({
      username: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed-password'
    });
    
    userId = user.id;
    
    sut = new RefreshTokenUseCase();
  });

  it('should be able to refresh token with valid user id', async () => {
    const { user } = await sut.execute({
      userId,
    });

    expect(user.id).toEqual(userId);
    expect(user.email).toEqual('johndoe@example.com');
  });

  it('should not be able to refresh token with non-existing user id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return the user data on successful refresh', async () => {
    const result = await sut.execute({
      userId,
    });

    expect(result).toHaveProperty('user');
    expect(result.user).toEqual(expect.objectContaining({
      id: userId,
      username: 'John Doe',
      email: 'johndoe@example.com'
    }));
  });
});