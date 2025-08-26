import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from '../controllers/subscriptions.controller';
import { SubscriptionsService } from '../services/subscriptions.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: jest.Mocked<SubscriptionsService>;

  const mockSubscriptionsService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategory: jest.fn(),
    findActiveByUser: jest.fn(),
    findUpcomingPayments: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'user123',
      email: 'test@example.com',
    },
  };

  const mockSubscription = {
    _id: 'subscription123',
    userId: 'user123',
    categoryId: {
      _id: 'category123',
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
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a subscription', async () => {
      const createDto: CreateSubscriptionDto = {
        categoryId: 'category123',
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

      service.create.mockResolvedValue(mockSubscription);

      const result = await controller.create(mockRequest, createDto);

      expect(service.create).toHaveBeenCalledWith('user123', createDto);
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('findAll', () => {
    it('should return all subscriptions for user when no category filter', async () => {
      const subscriptions = [mockSubscription];
      service.findAllByUser.mockResolvedValue(subscriptions);

      const result = await controller.findAll(mockRequest);

      expect(service.findAllByUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual(subscriptions);
    });

    it('should return subscriptions by category when category filter provided', async () => {
      const subscriptions = [mockSubscription];
      service.findByCategory.mockResolvedValue(subscriptions);

      const result = await controller.findAll(mockRequest, 'category123');

      expect(service.findByCategory).toHaveBeenCalledWith('category123');
      expect(result).toEqual(subscriptions);
    });
  });

  describe('findOne', () => {
    it('should return a subscription by id', async () => {
      service.findById.mockResolvedValue(mockSubscription);

      const result = await controller.findOne('subscription123', mockRequest);

      expect(service.findById).toHaveBeenCalledWith('subscription123', 'user123');
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('update', () => {
    it('should update a subscription', async () => {
      const updateDto: UpdateSubscriptionDto = {
        name: 'Updated Netflix',
        cost: 15.99,
      };
      const updatedSubscription = { ...mockSubscription, ...updateDto };

      service.update.mockResolvedValue(updatedSubscription);

      const result = await controller.update('subscription123', mockRequest, updateDto);

      expect(service.update).toHaveBeenCalledWith('subscription123', 'user123', updateDto);
      expect(result).toEqual(updatedSubscription);
    });
  });

  describe('remove', () => {
    it('should delete a subscription', async () => {
      service.remove.mockResolvedValue();

      const result = await controller.remove('subscription123', mockRequest);

      expect(service.remove).toHaveBeenCalledWith('subscription123', 'user123');
      expect(result).toEqual({ message: 'Subscription deleted successfully' });
    });
  });

  describe('findActive', () => {
    it('should return active subscriptions for user', async () => {
      const subscriptions = [mockSubscription];
      service.findActiveByUser.mockResolvedValue(subscriptions);

      const result = await controller.findActive(mockRequest);

      expect(service.findActiveByUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual(subscriptions);
    });
  });

  describe('findUpcomingPayments', () => {
    it('should return upcoming payments for user', async () => {
      const subscriptions = [mockSubscription];
      service.findUpcomingPayments.mockResolvedValue(subscriptions);

      const result = await controller.findUpcomingPayments('7', mockRequest);

      expect(service.findUpcomingPayments).toHaveBeenCalledWith('user123', 7);
      expect(result).toEqual(subscriptions);
    });
  });
});