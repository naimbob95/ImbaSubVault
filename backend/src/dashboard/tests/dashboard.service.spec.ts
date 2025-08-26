import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../services/dashboard.service';
import { SubscriptionsService } from '../../subscriptions/services/subscriptions.service';
import { DashboardOverview } from '../interfaces/dashboard-overview.interface';

describe('DashboardService', () => {
  let service: DashboardService;
  let subscriptionsService: jest.Mocked<SubscriptionsService>;

  const mockUserId = '507f1f77bcf86cd799439011';

  const mockSubscription1 = {
    _id: 'sub1',
    userId: mockUserId,
    categoryId: { name: 'Entertainment' },
    name: 'Netflix',
    cost: 12.99,
    billingCycle: 'monthly',
  } as any;

  const mockSubscription2 = {
    _id: 'sub2',
    userId: mockUserId,
    categoryId: { name: 'Software' },
    name: 'GitHub Pro',
    cost: 48,
    billingCycle: 'yearly',
  } as any;

  const mockSubscriptionsService = {
    calculateTotalMonthlyCost: jest.fn(),
    calculateTotalYearlyCost: jest.fn(),
    getSubscriptionCountByCategory: jest.fn(),
    findUpcomingPayments: jest.fn(),
    findActiveByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    subscriptionsService = module.get(SubscriptionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should return complete dashboard overview', async () => {
      const mockActiveSubscriptions = [mockSubscription1, mockSubscription2];
      const mockUpcomingPayments = [mockSubscription1];
      const mockCategoryCounts = { Entertainment: 1, Software: 1 };

      subscriptionsService.calculateTotalMonthlyCost.mockResolvedValue(16.99);
      subscriptionsService.calculateTotalYearlyCost.mockResolvedValue(203.88);
      subscriptionsService.getSubscriptionCountByCategory.mockResolvedValue(mockCategoryCounts);
      subscriptionsService.findUpcomingPayments.mockResolvedValue(mockUpcomingPayments);
      subscriptionsService.findActiveByUser.mockResolvedValue(mockActiveSubscriptions);

      const result: DashboardOverview = await service.getOverview(mockUserId);

      expect(result).toEqual({
        totalMonthlyCost: 16.99,
        totalYearlyCost: 203.88,
        subscriptionCountByCategory: mockCategoryCounts,
        upcomingPayments: mockUpcomingPayments,
        totalActiveSubscriptions: 2,
        averageMonthlyCost: 8.49,
        mostExpensiveSubscription: expect.objectContaining({
          name: 'Netflix',
          monthlyCost: 12.99,
        }),
        cheapestSubscription: expect.objectContaining({
          name: 'GitHub Pro',
          monthlyCost: 4,
        }),
      });

      expect(subscriptionsService.calculateTotalMonthlyCost).toHaveBeenCalledWith(mockUserId);
      expect(subscriptionsService.calculateTotalYearlyCost).toHaveBeenCalledWith(mockUserId);
      expect(subscriptionsService.getSubscriptionCountByCategory).toHaveBeenCalledWith(mockUserId);
      expect(subscriptionsService.findUpcomingPayments).toHaveBeenCalledWith(mockUserId, 7);
      expect(subscriptionsService.findActiveByUser).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle empty subscriptions list', async () => {
      subscriptionsService.calculateTotalMonthlyCost.mockResolvedValue(0);
      subscriptionsService.calculateTotalYearlyCost.mockResolvedValue(0);
      subscriptionsService.getSubscriptionCountByCategory.mockResolvedValue({});
      subscriptionsService.findUpcomingPayments.mockResolvedValue([]);
      subscriptionsService.findActiveByUser.mockResolvedValue([]);

      const result: DashboardOverview = await service.getOverview(mockUserId);

      expect(result).toEqual({
        totalMonthlyCost: 0,
        totalYearlyCost: 0,
        subscriptionCountByCategory: {},
        upcomingPayments: [],
        totalActiveSubscriptions: 0,
        averageMonthlyCost: 0,
        mostExpensiveSubscription: null,
        cheapestSubscription: null,
      });
    });
  });

  describe('getUpcomingPayments', () => {
    it('should return upcoming payments for default 7 days', async () => {
      const mockPayments = [mockSubscription1];
      subscriptionsService.findUpcomingPayments.mockResolvedValue(mockPayments);

      const result = await service.getUpcomingPayments(mockUserId);

      expect(subscriptionsService.findUpcomingPayments).toHaveBeenCalledWith(mockUserId, 7);
      expect(result).toEqual(mockPayments);
    });

    it('should return upcoming payments for custom days', async () => {
      const mockPayments = [mockSubscription1];
      subscriptionsService.findUpcomingPayments.mockResolvedValue(mockPayments);

      const result = await service.getUpcomingPayments(mockUserId, 14);

      expect(subscriptionsService.findUpcomingPayments).toHaveBeenCalledWith(mockUserId, 14);
      expect(result).toEqual(mockPayments);
    });
  });

  describe('getTotalMonthlyCost', () => {
    it('should return rounded monthly cost', async () => {
      subscriptionsService.calculateTotalMonthlyCost.mockResolvedValue(16.994);

      const result = await service.getTotalMonthlyCost(mockUserId);

      expect(subscriptionsService.calculateTotalMonthlyCost).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(16.99);
    });
  });

  describe('getTotalYearlyCost', () => {
    it('should return rounded yearly cost', async () => {
      subscriptionsService.calculateTotalYearlyCost.mockResolvedValue(203.876);

      const result = await service.getTotalYearlyCost(mockUserId);

      expect(subscriptionsService.calculateTotalYearlyCost).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(203.88);
    });
  });

  describe('getSubscriptionCountByCategory', () => {
    it('should return category counts', async () => {
      const mockCounts = { Entertainment: 2, Software: 1 };
      subscriptionsService.getSubscriptionCountByCategory.mockResolvedValue(mockCounts);

      const result = await service.getSubscriptionCountByCategory(mockUserId);

      expect(subscriptionsService.getSubscriptionCountByCategory).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockCounts);
    });
  });

  describe('getActiveSubscriptionsCount', () => {
    it('should return count of active subscriptions', async () => {
      subscriptionsService.findActiveByUser.mockResolvedValue([mockSubscription1, mockSubscription2]);

      const result = await service.getActiveSubscriptionsCount(mockUserId);

      expect(subscriptionsService.findActiveByUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(2);
    });
  });

  describe('getCostBreakdownByCategory', () => {
    it('should return cost breakdown by category', async () => {
      subscriptionsService.findActiveByUser.mockResolvedValue([mockSubscription1, mockSubscription2]);

      const result = await service.getCostBreakdownByCategory(mockUserId);

      expect(subscriptionsService.findActiveByUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({
        Entertainment: 12.99,
        Software: 4,
      });
    });

    it('should handle multiple subscriptions in same category', async () => {
      const mockSub3 = {
        ...mockSubscription1,
        _id: 'sub3',
        name: 'Spotify',
        cost: 9.99,
      };
      subscriptionsService.findActiveByUser.mockResolvedValue([
        mockSubscription1,
        mockSubscription2,
        mockSub3,
      ]);

      const result = await service.getCostBreakdownByCategory(mockUserId);

      expect(result).toEqual({
        Entertainment: 22.98,
        Software: 4,
      });
    });
  });
});