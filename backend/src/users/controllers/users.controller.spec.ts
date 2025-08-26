import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUsersService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    deleteAccount: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'user123',
      email: 'test@example.com',
    },
  };

  const mockUserResponse: UserResponseDto = {
    id: 'user123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      service.getProfile.mockResolvedValue(mockUserResponse);

      const result = await controller.getProfile(mockRequest);

      expect(service.getProfile).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const updatedResponse = { ...mockUserResponse, ...updateDto };

      service.updateProfile.mockResolvedValue(updatedResponse);

      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(service.updateProfile).toHaveBeenCalledWith('user123', updateDto);
      expect(result).toEqual(updatedResponse);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      service.deleteAccount.mockResolvedValue();

      const result = await controller.deleteAccount(mockRequest);

      expect(service.deleteAccount).toHaveBeenCalledWith('user123');
      expect(result).toEqual({ message: 'Account deleted successfully' });
    });
  });
});
