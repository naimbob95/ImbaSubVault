import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schemas/user.schema';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      repository.findById.mockResolvedValue(mockUser as any);

      const result = await service.getProfile('user123');

      expect(repository.findById).toHaveBeenCalledWith('user123');
      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('updateProfile', () => {
    const updateDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
    };

    it('should update user profile', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      repository.findById.mockResolvedValue(mockUser as any);
      repository.updateById.mockResolvedValue(updatedUser as any);

      const result = await service.updateProfile('user123', updateDto);

      expect(repository.findById).toHaveBeenCalledWith('user123');
      expect(repository.updateById).toHaveBeenCalledWith('user123', updateDto);
      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
    });

    it('should hash password when updating', async () => {
      const updateDtoWithPassword = { ...updateDto, password: 'newPassword' };
      const hashedPassword = 'hashedNewPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.findById.mockResolvedValue(mockUser as any);
      repository.updateById.mockResolvedValue(mockUser as any);

      await service.updateProfile('user123', updateDtoWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(repository.updateById).toHaveBeenCalledWith('user123', {
        ...updateDto,
        password: hashedPassword,
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const updateDtoWithEmail = { ...updateDto, email: 'existing@example.com' };
      const existingUser = { ...mockUser, email: 'existing@example.com' };

      repository.findById.mockResolvedValue(mockUser as any);
      repository.findByEmail.mockResolvedValue(existingUser as any);

      await expect(service.updateProfile('user123', updateDtoWithEmail)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should allow updating to same email', async () => {
      const updateDtoWithSameEmail = { ...updateDto, email: 'test@example.com' };

      repository.findById.mockResolvedValue(mockUser as any);
      repository.updateById.mockResolvedValue(mockUser as any);

      await service.updateProfile('user123', updateDtoWithSameEmail);

      expect(repository.findByEmail).not.toHaveBeenCalled();
      expect(repository.updateById).toHaveBeenCalledWith('user123', updateDtoWithSameEmail);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      repository.deleteById.mockResolvedValue(mockUser as any);

      await service.deleteAccount('user123');

      expect(repository.deleteById).toHaveBeenCalledWith('user123');
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.deleteById.mockResolvedValue(null);

      await expect(service.deleteAccount('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
