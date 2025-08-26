import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../../users/schemas/user.schema';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userModel: jest.Mocked<Model<User>>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const accessToken = 'jwt.token.here';

      userModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      userModel.create.mockResolvedValue(mockUser as any);
      jwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.register(registerDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userModel.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw ConflictException when user already exists', async () => {
      userModel.findOne.mockResolvedValue(mockUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('User with this email already exists'),
      );

      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userModel.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const accessToken = 'jwt.token.here';

      userModel.findOne.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.login(loginDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userModel.findOne.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
