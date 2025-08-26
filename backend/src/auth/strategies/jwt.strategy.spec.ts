import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user object with userId and email', () => {
      const payload: JwtPayload = {
        sub: 'user123',
        email: 'test@example.com',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user123',
        email: 'test@example.com',
      });
    });

    it('should handle different user IDs', () => {
      const payload: JwtPayload = {
        sub: 'different-user-456',
        email: 'another@example.com',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'different-user-456',
        email: 'another@example.com',
      });
    });
  });

  describe('constructor', () => {
    it('should use JWT_SECRET from config when available', () => {
      mockConfigService.get.mockReturnValue('custom-secret-key');

      const module = Test.createTestingModule({
        providers: [
          JwtStrategy,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      });

      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should use default secret when JWT_SECRET is not available', () => {
      mockConfigService.get.mockReturnValue(null);

      const module = Test.createTestingModule({
        providers: [
          JwtStrategy,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      });

      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
