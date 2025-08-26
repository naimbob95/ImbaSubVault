import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from '../services/subscriptions.service';
import { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let repository: SubscriptionsRepository;

  const mockUserId = '507f1f77bcf86cd799439011';
  const mockCategoryId = '507f1f77bcf86cd799439012';
  const mockSubscriptionId = '507f1f77bcf86cd799439013';

  const mockSubscription = {
    _id: mockSubscriptionId,
    userId: mockUserId,
    categoryId: {
      _id: mockCategoryId,
      name: 'Entertainment',
      description: 'Streaming services',
      color: '#FF6B6B',
      icon: 'entertainment',
    },
    name: 'Netflix',
    description: 'Streaming service',
    cost: 12.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: new Date('2024-01-01'),
    nextPaymentDate: new Date('2024-02-01'),
    isActive: true,
    website: 'https://netflix.com',
    notes: 'Premium plan',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSubscriptionsRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findByIdAndUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByCategory: jest.fn(),
    findActiveByUserId: jest.fn(),
    findUpcomingPayments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: SubscriptionsRepository,
          useValue: mockSubscriptionsRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    repository = module.get<SubscriptionsRepository>(SubscriptionsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createSubscriptionDto: CreateSubscriptionDto = {
      categoryId: mockCategoryId,
      name: 'Netflix',
      description: 'Streaming service',
      cost: 12.99,
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: '2024-01-01',
      nextPaymentDate: '2024-02-01',
      isActive: true,
      website: 'https://netflix.com',
      notes: 'Premium plan',
    };

    it('should create a subscription successfully', async () => {
      mockSubscriptionsRepository.create.mockResolvedValue(mockSubscription);

      const result = await service.create(mockUserId, createSubscriptionDto);

      expect(mockSubscriptionsRepository.create).toHaveBeenCalledWith(
        mockUserId,
        createSubscriptionDto,
      );
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('findAllByUser', () => {
    it('should return all subscriptions for a user', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionsRepository.findByUserId.mockResolvedValue(subscriptions);

      const result = await service.findAllByUser(mockUserId);

      expect(mockSubscriptionsRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(subscriptions);
    });
  });

  describe('findById', () => {
    it('should return a subscription by id', async () => {
      mockSubscriptionsRepository.findByIdAndUserId.mockResolvedValue(mockSubscription);

      const result = await service.findById(mockSubscriptionId, mockUserId);

      expect(mockSubscriptionsRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockSubscriptionId,
        mockUserId,
      );
      expect(result).toEqual(mockSubscription);
    });

    it('should throw NotFoundException if subscription not found', async () => {
      mockSubscriptionsRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.findById(mockSubscriptionId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockSubscriptionsRepository.findByIdAndUserId).toHaveBeenCalledWith(
        mockSubscriptionId,
        mockUserId,
      );
    });
  });

  describe('update', () => {
    const updateSubscriptionDto: UpdateSubscriptionDto = {
      name: 'Updated Netflix',
      cost: 15.99,
    };

    it('should update a subscription successfully', async () => {
      const updatedSubscription = { ...mockSubscription, ...updateSubscriptionDto };
      mockSubscriptionsRepository.update.mockResolvedValue(updatedSubscription);

      const result = await service.update(mockSubscriptionId, mockUserId, updateSubscriptionDto);

      expect(mockSubscriptionsRepository.update).toHaveBeenCalledWith(
        mockSubscriptionId,
        mockUserId,
        updateSubscriptionDto,
      );
      expect(result).toEqual(updatedSubscription);
    });

    it('should throw NotFoundException if subscription not found', async () => {
      mockSubscriptionsRepository.update.mockResolvedValue(null);

      await expect(
        service.update(mockSubscriptionId, mockUserId, updateSubscriptionDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a subscription successfully', async () => {
      mockSubscriptionsRepository.delete.mockResolvedValue(mockSubscription);

      await service.remove(mockSubscriptionId, mockUserId);

      expect(mockSubscriptionsRepository.delete).toHaveBeenCalledWith(
        mockSubscriptionId,
        mockUserId,
      );
    });

    it('should throw NotFoundException if subscription not found', async () => {
      mockSubscriptionsRepository.delete.mockResolvedValue(null);

      await expect(service.remove(mockSubscriptionId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCategory', () => {
    it('should return subscriptions by category', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionsRepository.findByCategory.mockResolvedValue(subscriptions);

      const result = await service.findByCategory(mockCategoryId);

      expect(mockSubscriptionsRepository.findByCategory).toHaveBeenCalledWith(mockCategoryId);
      expect(result).toEqual(subscriptions);
    });
  });

  describe('findActiveByUser', () => {
    it('should return active subscriptions for a user', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionsRepository.findActiveByUserId.mockResolvedValue(subscriptions);

      const result = await service.findActiveByUser(mockUserId);

      expect(mockSubscriptionsRepository.findActiveByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(subscriptions);
    });
  });

  describe('findUpcomingPayments', () => {
    it('should return upcoming payments for a user', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionsRepository.findUpcomingPayments.mockResolvedValue(subscriptions);

      const result = await service.findUpcomingPayments(mockUserId, 7);

      expect(mockSubscriptionsRepository.findUpcomingPayments).toHaveBeenCalledWith(
        mockUserId,
        7,
      );
      expect(result).toEqual(subscriptions);
    });

    it('should use default 7 days if not specified', async () => {
      const subscriptions = [mockSubscription];
      mockSubscriptionsRepository.findUpcomingPayments.mockResolvedValue(subscriptions);

      const result = await service.findUpcomingPayments(mockUserId);

      expect(mockSubscriptionsRepository.findUpcomingPayments).toHaveBeenCalledWith(
        mockUserId,
        7,
      );
      expect(result).toEqual(subscriptions);
    });
  });

  describe('calculateTotalMonthlyCost', () => {
    it('should calculate total monthly cost correctly', async () => {
      const subscriptions = [
        { ...mockSubscription, billingCycle: 'monthly', cost: 12.99 },
        { ...mockSubscription, billingCycle: 'yearly', cost: 120, _id: '2' },
        { ...mockSubscription, billingCycle: 'weekly', cost: 5, _id: '3' },
        { ...mockSubscription, billingCycle: 'daily', cost: 1, _id: '4' },
      ];
      mockSubscriptionsRepository.findActiveByUserId.mockResolvedValue(subscriptions);

      const result = await service.calculateTotalMonthlyCost(mockUserId);

      expect(mockSubscriptionsRepository.findActiveByUserId).toHaveBeenCalledWith(mockUserId);
      // monthly: 12.99 + yearly: 120/12 = 10 + weekly: 5*52/12 ≈ 21.67 + daily: 1*365/12 ≈ 30.42
      expect(result).toBeCloseTo(75.07, 1);
    });
  });

  describe('calculateTotalYearlyCost', () => {
    it('should calculate total yearly cost correctly', async () => {
      const subscriptions = [
        { ...mockSubscription, billingCycle: 'monthly', cost: 12.99 },
        { ...mockSubscription, billingCycle: 'yearly', cost: 120, _id: '2' },
        { ...mockSubscription, billingCycle: 'weekly', cost: 5, _id: '3' },
        { ...mockSubscription, billingCycle: 'daily', cost: 1, _id: '4' },
      ];
      mockSubscriptionsRepository.findActiveByUserId.mockResolvedValue(subscriptions);

      const result = await service.calculateTotalYearlyCost(mockUserId);

      expect(mockSubscriptionsRepository.findActiveByUserId).toHaveBeenCalledWith(mockUserId);
      // monthly: 12.99*12 = 155.88 + yearly: 120 + weekly: 5*52 = 260 + daily: 1*365 = 365
      expect(result).toBeCloseTo(900.88, 2);
    });
  });

  describe('getSubscriptionCountByCategory', () => {
    it('should return subscription count by category', async () => {
      const subscriptions = [
        { ...mockSubscription, categoryId: { name: 'Entertainment' } },
        { ...mockSubscription, _id: '2', categoryId: { name: 'Entertainment' } },
        { ...mockSubscription, _id: '3', categoryId: { name: 'Software' } },
      ];
      mockSubscriptionsRepository.findActiveByUserId.mockResolvedValue(subscriptions);

      const result = await service.getSubscriptionCountByCategory(mockUserId);

      expect(mockSubscriptionsRepository.findActiveByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({
        Entertainment: 2,
        Software: 1,
      });
    });
  });
});